import { msalJwtKeys } from "test/fixtures/jwt";
import { Mock, afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getKeyById } from "./jwks";

describe("jwks", () => {
  beforeAll(() => {
    global.fetch = vi.fn();
    const mockResponse = {
      json: vi.fn().mockResolvedValue({ keys: msalJwtKeys }),
    };
    (global.fetch as Mock).mockResolvedValue(mockResponse);
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
  describe("getKeyById", () => {
    it("should fetch the key from the correct URL", async () => {
      const key = await getKeyById(
        "https://login.microsoftonline.com/00000000-0000-0000-0000-000000000003/v2.0",
        "unique-key-id",
      );
      expect(key).toMatchInlineSnapshot(`
        {
          "e": "AQAB",
          "kid": "unique-key-id",
          "kty": "RSA",
          "n": "yAOaWYU7j6-DoJVW05zy0jIv7654LjlqHtXnOTGL2KgPfKifWVaNknZKCYEwicXX6Mfk3Yw83OrUP0qX9fP-wZ5vXpOzTpyieMJnnRuRl-IzJNS9mhlDmX2QYxHc_SMdd5qaDPw6AqJTZ1OyRLNBTAcRbgZUJx7EzAmGBd-g6xzdyKVl-WNSFkB8TeO731VEr0vUBYTx18_vZH4Bmf7bk8O2sIBbSsnD303Q9BjdMjsb9iR3IAD6HH8Ds0jboP9G3MHvvcTtTSgqLApopXx9Cim7O3yJqdpm99TRovy1qbrXDwUYt4KiyKv35S91UnaMbKCIBE_7u37A-Pry7kZa7Q",
          "use": "sig",
        }
      `);
    });
  });
});
