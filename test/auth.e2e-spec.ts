import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: 'test@gmail.com',
        password: 'test1234',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('name');
  });

  it('should not register a user if email already exists', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test@gmail.com',
      name: 'John Doe',
      password: 'test1234',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@gmail.com',
        name: 'John Doe',
        password: 'test1234',
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('User already exists');
  });

  it('should login a user', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test1234@gmail.com',
      name: 'John Doe',
      password: 'test1234',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test1234@gmail.com',
        password: 'test1234',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('refreshToken');
  });

  it('should not login a user if email does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test1235@gmail.com',
        password: 'test1234',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should not login a user if password is wrong', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test1235@gmail.com',
      name: 'John Doe',
      password: 'test1234',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test1235@gmail.com',
        password: 'test1232',
      });

    console.log(response.body);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should refresh a token', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Authorization', `Bearer ${loginResponse.body.user.token}`)
      .send({ refreshToken: loginResponse.body.user.refreshToken });

    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toHaveProperty('userId');
    expect(response.body.user).toHaveProperty('refreshToken');
    expect(response.body.user).toHaveProperty('expiresAt');
  });
});
