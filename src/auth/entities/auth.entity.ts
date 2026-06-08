export class Auth {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly token?: string,
  ) {}
}

export class Token {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
    public readonly expiresAt: Date,
  ) {}
}
