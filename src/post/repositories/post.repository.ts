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

  async findById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) return null;

    return new Post(post.id, post.title, post.content, post.authorId);
  }

  async findAll() {
    const posts = await this.prisma.post.findMany();

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

  async deletePost(postId: string) {
    const deletedPost = await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return new Post(
      deletedPost.id,
      deletedPost.title,
      deletedPost.content,
      deletedPost.authorId,
    );
  }
}
