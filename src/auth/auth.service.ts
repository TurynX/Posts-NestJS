import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user-use-case';

@Injectable()
export class AuthService {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

  async register(dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto.email, dto.name, dto.password);
  }

  async login(dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }
}
