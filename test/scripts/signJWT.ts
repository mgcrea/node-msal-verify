import { promises as fs } from "fs";
import jwt, { Algorithm } from "jsonwebtoken";

const signJWT = async () => {
  try {
    const privateKey = await fs.readFile("test/fixtures/private_key.pem", "utf8");

    const payload = {
      aio: "mockedAio",
      aud: "00000000-0000-0000-0000-000000000001",
      exp: 1732017631,
      iat: 1732013731,
      iss: "https://login.microsoftonline.com/{tenant_id}/v2.0",
      name: "John Doe",
      nbf: 1732013731,
      nonce: "mockedNonce",
      oid: "00000000-0000-0000-0000-000000000002",
      preferred_username: "user@example.com",
      rh: "mockedRh",
      sub: "00000000000000000000000000000000",
      tid: "00000000-0000-0000-0000-000000000003",
      uti: "mockedUti",
      ver: "2.0",
    };

    const signOptions = {
      algorithm: "RS256" as Algorithm,
      keyid: "unique-key-id", // Must match the 'kid' in JWKS
    };

    const token = jwt.sign(payload, privateKey, signOptions);

    console.log("Signed JWT:", token);
  } catch (error) {
    console.error("Error signing JWT:", error);
  }
};

void signJWT();
