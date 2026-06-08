import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Token } from '../entities/auth.entity';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { AUTH_REPOSITORY } from '../repositories/auth.repository.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private authRepository: IAuthRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<Token> {
    const isTokenValid =
      await this.authRepository.findByRefreshToken(refreshToken);
    if (!isTokenValid || isTokenValid.userId !== userId) {
      throw new UnauthorizedException('Invalid token');
    }
    if (isTokenValid.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    const newToken = randomUUID();
    return this.authRepository.refreshToken(userId, newToken);
  }
}
