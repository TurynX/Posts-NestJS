import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user-use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

@Injectable()
export class AuthService {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async register(dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto.email, dto.name, dto.password);
  }

  async login(dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }

  async refreshToken(userId: string, refreshToken: string) {
    return this.refreshTokenUseCase.execute(userId, refreshToken);
  }
}
