import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AuthModule } from 'src/auth/auth.module';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { GetAllPostsUseCase } from './use-cases/get-all-posts.use-case';
import { GetPostByAuthorUseCase } from './use-cases/get-post-by-author.use-case';
import { DeletePostUseCase } from './use-cases/delete-post.use-case';
import { POST_REPOSITORY } from './repositories/post.repository.interface';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [AuthModule],
  controllers: [PostController],
  providers: [
    PostService,
    CreatePostUseCase,
    GetAllPostsUseCase,
    GetPostByAuthorUseCase,
    DeletePostUseCase,
    {
      provide: POST_REPOSITORY,
      useClass: PostRepository,
    },
  ],
})
export class PostModule {}
