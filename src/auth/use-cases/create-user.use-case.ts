import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { Auth } from '../entities/auth.entity';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { AUTH_REPOSITORY } from '../repositories/auth.repository.interface';
import * as argon2 from 'argon2';
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private authRepository: IAuthRepository,
  ) {}

  async execute(email: string, name: string, password: string): Promise<Auth> {
    const user = await this.authRepository.findByEmail(email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await argon2.hash(password);
    return this.authRepository.create(email, name, hashedPassword);
  }
}
