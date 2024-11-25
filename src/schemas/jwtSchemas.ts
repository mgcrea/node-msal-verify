import { z } from "zod";

export const jwkSchema = z.object({
  kty: z.union([z.literal("RSA"), z.literal("EC"), z.literal("oct")]),
  use: z.union([z.literal("sig"), z.literal("enc")]),
  kid: z.string(),
  alg: z.string().optional(),
  n: z.string().optional(),
  e: z.string().optional(),
  x5c: z.array(z.string()).optional(),
  x5t: z.string().optional(),
  x5tS256: z.string().optional(),
  // Optional fields for Azure AD specific keys
  cloud_instance_name: z.string().optional(),
  issuer: z.string().optional(),
});

export type JWKey = z.infer<typeof jwkSchema>;

export const jwtHeaderSchema = z.object({
  alg: z.string(),
  typ: z.string(),
  kid: z.string(),
});

export type JWTHeader = z.infer<typeof jwtHeaderSchema>;

export const jwksResponseSchema = z.object({
  keys: z.array(jwkSchema),
});

export const jwtClaimsSchema = z.object({
  aud: z.string(), // Audience: typically present in all tokens
  iss: z.string(), // Issuer: typically present in all tokens
  iat: z.number(), // Issued at: timestamp, typically present
  nbf: z.number(), // Not before: timestamp, typically present
  exp: z.number(), // Expiration time: timestamp, typically present
  aio: z.string().optional(), // Azure AD specific claim, might not be present
  name: z.string().optional(), // User name, might not be present in all tokens
  nonce: z.string().optional(), // Nonce used in authentication response
  oid: z.string().optional(), // Object identifier for the user, might not be present
  preferred_username: z.string().optional(), // User's preferred username
  rh: z.string().optional(), // Resource header for token refresh scenarios
  sub: z.string(), // Subject: should be in all tokens
  tid: z.string(), // Tenant ID: should be in all tokens
  uti: z.string().optional(), // Unique token identifier for validation
  ver: z.string().optional(), // Token version, could be absent
});

export type JWTClaims = z.infer<typeof jwtClaimsSchema>;
