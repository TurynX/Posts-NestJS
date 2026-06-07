import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostRepository } from './post.repository.interface';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string, content: string, authorId: string) {
    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    return new Post(post.id, post.title, post.content, post.authorId);
  }

  async findAll() {
    const posts = await this.prisma.post.findMany();

    if (!posts) {
      throw new Error('Posts not found');
    }

    return posts.map(
      (post) => new Post(post.id, post.title, post.content, post.authorId),
    );
  }

  async findPostsByAuthorId(authorId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId,
      },
    });

    return posts.map(
      (post) => new Post(post.id, post.title, post.content, post.authorId),
    );
  }

  async deletePost(postId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('User not authorized to delete this post');
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return new Post(post.id, post.title, post.content, post.authorId);
  }
}
