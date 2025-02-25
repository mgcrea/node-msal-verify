import assert from "node:assert";
import { describe, expect, it } from "vitest";
import { decodeBase64Url } from "./base64";

describe("decodeBase64Url", () => {
  it("should decode a valid base64Url string without padding", () => {
    const base64Url = "SGVsbG8td29ybGQ"; // "Hello-world" in base64Url without padding
    const expected = Buffer.from("Hello-world", "utf-8");
    const result = decodeBase64Url(base64Url);
    expect(result.equals(expected)).toBe(true);
  });

  it("should decode a valid base64Url string with padding", () => {
    const base64Url = "SGVsbG8td29ybGQ="; // "Hello-world" in base64Url with padding
    const expected = Buffer.from("Hello-world", "utf-8");
    const result = decodeBase64Url(base64Url);
    expect(result.equals(expected)).toBe(true);
  });

  it("should decode a base64Url string with URL-safe characters", () => {
    const base64Url = "VGhpcy1pcyBhIHRlc3Q"; // "This-is a test" in base64Url
    const expected = Buffer.from("This-is a test", "utf-8");
    const result = decodeBase64Url(base64Url);
    expect(result.equals(expected)).toBe(true);
  });

  it("should add correct padding when necessary", () => {
    const base64Url = "U29tZV9kYXRhLXRvLWVuY29kZQ"; // "Some_data-to-encode" without padding
    const expected = Buffer.from("Some_data-to-encode", "utf-8");
    const result = decodeBase64Url(base64Url);
    expect(result.equals(expected)).toBe(true);
  });

  it("should handle empty string by throwing an assertion error", () => {
    const base64Url = "";
    expect(() => decodeBase64Url(base64Url)).toThrowError(
      new assert.AssertionError({
        message: "Invalid base64UrlString",
        expected: true,
        operator: "==",
        actual: "",
      }),
    );
  });

  it("should handle undefined input by throwing an assertion error", () => {
    expect(() => decodeBase64Url(undefined)).toThrowError(
      new assert.AssertionError({ message: "Invalid base64UrlString", expected: true, operator: "==" }),
    );
  });

  it("should correctly decode strings with multiple padding requirements", () => {
    const base64Url = "YWJj"; // "abc" in base64Url without padding
    const expected = Buffer.from("abc", "utf-8");
    const result = decodeBase64Url(base64Url);
    expect(result.equals(expected)).toBe(true);
  });

  it("should decode strings with mixed URL-safe characters and padding", () => {
    const base64Url = "c29tZS1kYXRhL3dpdGg_X2Nhc2Vz"; // "some-data/with?_cases" in base64Url
    const expected = Buffer.from("some-data/with?_cases", "utf-8");
    const result = decodeBase64Url(base64Url);
    expect(result.equals(expected)).toBe(true);
  });
});
