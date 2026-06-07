import { Inject } from '@nestjs/common';
import type { IPostRepository } from '../repositories/post.repository.interface';
import { POST_REPOSITORY } from '../repositories/post.repository.interface';

export class GetAllPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute() {
    return this.postRepository.findAll();
  }
}
