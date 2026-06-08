import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { AuthGuard } from './auth.guard';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user-use-case';
import { AUTH_REPOSITORY } from './repositories/auth.repository.interface';
import { AuthRepository } from './repositories/auth.repository';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    CreateUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
  ],

  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
