export class Auth {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly token?: string,
  ) {}
}
