import { Post } from '../entities/post.entity';

export interface IPostRepository {
  create(title: string, content: string, authorId: string): Promise<Post>;
  findAll(): Promise<Post[]>;
  findById(postId: string): Promise<Post | null>;
  findPostsByAuthorId(authorId: string): Promise<Post[]>;
  deletePost(postId: string): Promise<Post>;
}

export const POST_REPOSITORY = 'POST_REPOSITORY';
