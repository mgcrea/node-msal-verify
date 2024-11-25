import { promises as fs } from "fs";
import { pem2jwk } from "pem-jwk";

const convertPublicKeyToJWK = async () => {
  try {
    const publicKeyPem = await fs.readFile("test/fixtures/public_key.pem", "utf8");
    const jwk = pem2jwk(publicKeyPem);

    // Add necessary JWK properties
    jwk["kid"] = "unique-key-id"; // Assign a unique Key ID
    jwk["use"] = "sig"; // Usage: signature

    const jwks = {
      keys: [jwk],
    };

    await fs.writeFile("jwks.json", JSON.stringify(jwks, null, 2));
    console.log("JWKS generated and saved to jwks.json");
  } catch (error) {
    console.error("Error converting public key to JWK:", error);
  }
};

void convertPublicKeyToJWK();
