import { Inject, Injectable } from '@nestjs/common';
import type { Auth } from '../entities/auth.entity';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { AUTH_REPOSITORY } from '../repositories/auth.repository.interface';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private authRepository: IAuthRepository,
  ) {}

  execute(email: string, name: string, password: string): Promise<Auth> {
    return this.authRepository.create(email, name, password);
  }
}
