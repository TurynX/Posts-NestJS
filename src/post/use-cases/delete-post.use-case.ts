import { Inject } from '@nestjs/common';
import type { IPostRepository } from '../repositories/post.repository.interface';
import { POST_REPOSITORY } from '../repositories/post.repository.interface';

export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, authorId: string) {
    return this.postRepository.deletePost(postId, authorId);
  }
}
