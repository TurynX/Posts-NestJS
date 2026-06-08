import { Auth, Token } from '../entities/auth.entity';

export interface IAuthRepository {
  create(email: string, name: string, password: string): Promise<Auth>;
  refreshToken(userId: string, refreshToken: string): Promise<Token>;
  findByRefreshToken(refreshToken: string): Promise<Token | null>;
  findByEmail(email: string): Promise<Auth | null>;
  findById(id: string): Promise<Auth | null>;
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
