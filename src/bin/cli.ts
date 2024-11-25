#!/usr/bin/env node

import assert from "node:assert";
import { verifyToken } from "src/verify";

const [action = "help", ...args] = process.argv.slice(2);

// eslint-disable-next-line @typescript-eslint/require-await
const main = async () => {
  switch (action) {
    case "verify": {
      const [jwksUri, token] = args.map(String);
      assert(jwksUri, "Missing jwksUri");
      assert(token, "Missing token");
      const claims = verifyToken({ jwksUri, token });
      console.log(claims);
      break;
    }
    default:
      console.log("Sorry, that is not something I know how to do.");
      console.log(`Try random`);
  }
};

void main();
