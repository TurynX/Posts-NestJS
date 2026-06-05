import {
  Controller,
  Body,
  HttpCode,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
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
    return this.postService.create(dto, sub);
  }

  @Get('get')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getAll() {
    return this.postService.getAll();
  }
}
