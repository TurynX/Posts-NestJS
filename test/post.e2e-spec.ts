import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.post.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});

    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test1234@gmail.com',
      name: 'John Doe',
      password: 'test1234',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test1234@gmail.com',
        password: 'test1234',
      });

    token = loginResponse.body.user.token;
    userId = loginResponse.body.user.userId;
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should create a new post', async () => {
    const response = await request(app.getHttpServer())
      .post('/post/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.post).toHaveProperty('id');
    expect(response.body.post).toHaveProperty('title');
    expect(response.body.post).toHaveProperty('content');
  });

  it('should get all posts', async () => {
    await request(app.getHttpServer())
      .post('/post/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
      });
    const response = await request(app.getHttpServer())
      .get('/post/get')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get post by author', async () => {
    await request(app.getHttpServer())
      .post('/post/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
      });
    const response = await request(app.getHttpServer())
      .get(`/post/get/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should delete post', async () => {
    const post = await request(app.getHttpServer())
      .post('/post/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
      });

    const postId = post.body.post.id;
    const response = await request(app.getHttpServer())
      .delete(`/post/delete/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('post');
  });
});
