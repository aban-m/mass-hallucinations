export class PrivacyError extends Error {}
export class InsufficientCreditError extends Error {}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
