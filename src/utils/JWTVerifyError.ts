export class JWTVerifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JWTVerifyError";
  }
}
