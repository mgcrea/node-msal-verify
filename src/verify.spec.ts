import { msalIdToken, msalJwtKeys } from "test/fixtures/jwt";
import { Mock, afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyToken } from "./verify";

describe("verify", () => {
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
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  describe("verifyToken", () => {
    it("should verify the token", async () => {
      const date = new Date(1732013731 * 1000);
      vi.setSystemTime(date);
      const claims = await verifyToken({
        token: msalIdToken,
        tenantId: "00000000-0000-0000-0000-000000000003",
        clientId: "00000000-0000-0000-0000-000000000001",
      });
      expect(claims).toMatchInlineSnapshot(`
        {
          "aio": "mockedAio",
          "aud": "00000000-0000-0000-0000-000000000001",
          "exp": 1732017631,
          "iat": 1732013731,
          "iss": "https://login.microsoftonline.com/{tenant_id}/v2.0",
          "name": "John Doe",
          "nbf": 1732013731,
          "nonce": "mockedNonce",
          "oid": "00000000-0000-0000-0000-000000000002",
          "preferred_username": "user@example.com",
          "rh": "mockedRh",
          "sub": "00000000000000000000000000000000",
          "tid": "00000000-0000-0000-0000-000000000003",
          "uti": "mockedUti",
          "ver": "2.0",
        }
      `);
    });
  });
});
