import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsString()
  @MinLength(10)
  readonly content: string;
}
