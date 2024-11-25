import assert from "node:assert";
import { createVerify } from "node:crypto";
import { jwtClaimsSchema, jwtHeaderSchema } from "src/schemas";
import { decodeBase64Url, getKeyById, JWTVerifyError } from "src/utils";

export const JWK_TO_ALG = {
  RSA: "RSA-SHA256",
};

type VerifyTokenOptions =
  | {
      token: string;
      jwksUri?: string;
      tenantId: string;
      clientId?: string;
    }
  | {
      token: string;
      jwksUri: string;
      tenantId?: string;
      clientId?: string;
    };

// @docs https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference#payload-claims
export const verifyToken = async ({ token, tenantId, clientId, ...options }: VerifyTokenOptions) => {
  const jwksUri = options.jwksUri ?? `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
  const tokenParts = token.split(".");
  assert(tokenParts.length === 3 && tokenParts[0], "Invalid token format");
  const header = jwtHeaderSchema.parse(JSON.parse(decodeBase64Url(tokenParts[0]).toString()));
  const key = await getKeyById(jwksUri, header.kid);
  const signature = decodeBase64Url(tokenParts[2]);
  assert(key.kty in JWK_TO_ALG, `Unsupported key type ${key.kty}`);
  const alg = JWK_TO_ALG[key.kty as keyof typeof JWK_TO_ALG];
  const verify = createVerify(alg);
  verify.update(`${tokenParts[0]}.${tokenParts[1]}`);
  const result = verify.verify({ key, format: "jwk" }, signature);
  if (!result) {
    throw new JWTVerifyError("Invalid signature");
  }
  const claims = jwtClaimsSchema.parse(JSON.parse(decodeBase64Url(tokenParts[1]).toString()));
  if (claims.tid !== tenantId) {
    throw new JWTVerifyError("Invalid tenant");
  }
  if (claims.aud && clientId && claims.aud !== clientId) {
    throw new JWTVerifyError("Invalid audience");
  }
  const origin = new URL(jwksUri).origin;
  if (claims.iss && !claims.iss.startsWith(origin)) {
    throw new JWTVerifyError("Invalid issuer");
  }
  if (claims.exp && claims.exp * 1000 < Date.now()) {
    throw new JWTVerifyError("Token expired");
  }
  if (claims.nbf && claims.nbf * 1000 > Date.now()) {
    throw new JWTVerifyError("Token not yet valid");
  }
  return claims;
};
