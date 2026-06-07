import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { GetAllPostsUseCase } from './use-cases/get-all-posts.use-case';
import { DeletePostUseCase } from './use-cases/delete-post.use-case';
import { GetPostByAuthorUseCase } from './use-cases/get-post-by-author.use-case';

@Injectable()
export class PostService {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getAllPostsUseCase: GetAllPostsUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostByAuthorUseCase: GetPostByAuthorUseCase,
  ) {}

  async create(dto: CreatePostDto, authorId: string) {
    const post = await this.createPostUseCase.execute(
      dto.title,
      dto.content,
      authorId,
    );
    return post;
  }

  async getAll() {
    return this.getAllPostsUseCase.execute();
  }

  async getByAuthor(authorId: string) {
    return this.getPostByAuthorUseCase.execute(authorId);
  }

  async delete(postId: string, authorId: string) {
    return this.deletePostUseCase.execute(postId, authorId);
  }
}
