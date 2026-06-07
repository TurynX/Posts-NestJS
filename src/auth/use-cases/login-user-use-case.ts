import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { AUTH_REPOSITORY } from '../repositories/auth.repository.interface';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private authRepository: IAuthRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<{ token: string }> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id });

    return { token };
  }
}
