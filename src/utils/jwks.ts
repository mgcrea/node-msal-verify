import assert from "node:assert";
import { type JWKey, jwksResponseSchema } from "src/schemas";

export const getKeyById = async (jwksUri: string, id: string): Promise<JWKey> => {
  const res = await fetch(jwksUri);
  const json = await res.json();
  const { keys } = jwksResponseSchema.parse(json);
  const key = keys.find((k) => k.kid === id);
  assert(key, `Key with id ${id} not found`);
  return key;
};
