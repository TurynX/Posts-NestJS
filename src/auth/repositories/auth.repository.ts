import { Injectable } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import { Auth, Token } from '../entities/auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    email: string,
    name: string,
    hashedPassword: string,
  ): Promise<Auth> {
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return new Auth(user.id, user.email, user.name, user.password);
  }

  async refreshToken(userId: string, newToken: string): Promise<Token> {
    const refreshedToken = await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({
        where: {
          userId,
        },
      });

      return await tx.refreshToken.create({
        data: {
          userId,
          token: newToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    });
    return new Token(
      refreshedToken.userId,
      refreshedToken.token,
      refreshedToken.expiresAt,
    );
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });
    if (!token) return null;
    return new Token(token.userId, token.token, token.expiresAt);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return new Auth(user.id, user.email, user.name, user.password);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return new Auth(user.id, user.email, user.name, user.password);
  }
}
