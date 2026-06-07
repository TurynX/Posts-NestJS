import { Inject, NotFoundException } from '@nestjs/common';
import {
  type IPostRepository,
  POST_REPOSITORY,
} from '../repositories/post.repository.interface';
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from 'src/auth/repositories/auth.repository.interface';

export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,

    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(title: string, content: string, authorId: string) {
    const user = await this.authRepository.findById(authorId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.postRepository.create(title, content, user.id);
  }
}
