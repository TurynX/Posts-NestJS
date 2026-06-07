import { Auth } from '../entities/auth.entity';

export interface IAuthRepository {
  create(email: string, name: string, password: string): Promise<Auth>;
  findByEmail(email: string): Promise<Auth | null>;
  findById(id: string): Promise<Auth | null>;
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
