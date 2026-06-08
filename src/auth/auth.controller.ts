import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);

    return { message: 'User registered successfully', user };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto);

    return { message: 'User logged in successfully', user };
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async refreshToken(@Req() req: any, @Body() dto: RefreshTokenDto) {
    const userId = req.user.sub;
    const user = await this.authService.refreshToken(userId, dto.refreshToken);

    return { message: 'Token refreshed successfully', user };
  }
}
