import {
  Controller,
  Body,
  HttpCode,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async create(@Request() req: any, @Body() dto: CreatePostDto) {
    const sub = req.user.sub;
    if (!sub) {
      throw new UnauthorizedException('User not found');
    }
    const post = await this.postService.create(dto, sub);

    return { message: 'Post created successfully', post };
  }

  @Get('get')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getAll() {
    return this.postService.getAll();
  }

  @Get('get/:authorId')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getByAuthor(@Request() req: any) {
    const authorId = req.params.authorId;
    if (!authorId) {
      throw new UnauthorizedException('Missing authorId parameter');
    }
    return this.postService.getByAuthor(authorId);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async delete(@Request() req: any) {
    const id = req.params.id;
    if (!id) {
      throw new UnauthorizedException('Missing id parameter');
    }
    const authorId = req.user.sub;

    const post = await this.postService.delete(id, authorId);

    return { message: 'Post deleted successfully', post };
  }
}
