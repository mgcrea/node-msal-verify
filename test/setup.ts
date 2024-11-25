/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { expect } from "vitest";

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = typeof received === "number" && received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `Expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
  toBeArray(received) {
    const pass = Array.isArray(received);
    if (pass) {
      return {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: () => `Expected ${received} not to be an array`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be an array`,
        pass: false,
      };
    }
  },
});

interface CustomMatchers<R = unknown> {
  toBeWithinRange(floor: number, ceiling: number): R;
  toBeArray(): R;
}
declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
