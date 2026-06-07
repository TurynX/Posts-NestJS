import { Auth } from '../entities/auth.entity';

export interface IAuthRepository {
  create(email: string, name: string, password: string): Promise<Auth>;
  signIn(email: string, password: string): Promise<Auth>;
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
