import { Injectable } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import { Auth } from '../entities/auth.entity';
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
