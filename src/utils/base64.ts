import assert from "node:assert";

export const decodeBase64Url = (base64UrlString: string | undefined) => {
  assert(base64UrlString, "Invalid base64UrlString");
  // Replace non-url compatible chars with base64 standard chars
  let base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");
  // Pad out with standard base64 required padding characters
  const padLength = (4 - (base64.length % 4)) % 4;
  base64 += "=".repeat(padLength);
  return Buffer.from(base64, "base64");
};
