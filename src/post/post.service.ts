import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, authorId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId,
      },
    });
    return post;
  }

  async getAll() {
    const posts = await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return posts;
  }
}
