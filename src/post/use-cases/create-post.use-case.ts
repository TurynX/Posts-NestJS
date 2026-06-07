import { Inject } from '@nestjs/common';
import type { IPostRepository } from '../repositories/post.repository.interface';
import { POST_REPOSITORY } from '../repositories/post.repository.interface';

export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(title: string, content: string, authorId: string) {
    return this.postRepository.create(title, content, authorId);
  }
}
