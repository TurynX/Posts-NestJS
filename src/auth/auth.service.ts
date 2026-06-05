import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user) {
      return { message: 'User already exists' };
    }

    const password = await argon2.hash(dto.password);
    return await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      return { message: 'User not found' };
    }

    const validPassword = await argon2.verify(user.password, dto.password);
    if (!validPassword) {
      return { message: 'Invalid password' };
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  }
}
