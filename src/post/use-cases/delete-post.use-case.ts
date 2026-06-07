import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  type IPostRepository,
  POST_REPOSITORY,
} from '../repositories/post.repository.interface';

import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from 'src/auth/repositories/auth.repository.interface';

export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,

    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(postId: string, authorId: string) {
    const user = await this.authRepository.findById(authorId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== user.id) {
      throw new ForbiddenException('User not authorized to delete this post');
    }

    return this.postRepository.deletePost(postId);
  }
}
