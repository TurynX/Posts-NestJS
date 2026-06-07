import { Inject, NotFoundException } from '@nestjs/common';
import type { IPostRepository } from '../repositories/post.repository.interface';
import { POST_REPOSITORY } from '../repositories/post.repository.interface';

export class GetAllPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute() {
    const posts = await this.postRepository.findAll();

    return posts;
  }
}
