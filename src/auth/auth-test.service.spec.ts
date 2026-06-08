import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user-use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockLoginUserUseCase = { execute: jest.fn() };
  const mockRefreshTokenUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: LoginUserUseCase, useValue: mockLoginUserUseCase },
        { provide: RefreshTokenUseCase, useValue: mockRefreshTokenUseCase },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    mockCreateUserUseCase.execute.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: 'Test',
      password: 'password',
    });
    const user = await service.register({
      email: 'test@test.com',
      name: 'Test',
      password: 'password',
    });
    expect(user).toBeDefined();
    expect(user.email).toBe('test@test.com');
    expect(user.name).toBe('Test');
    expect(user).toHaveProperty('password');
  });

  it('should login a user', async () => {
    mockLoginUserUseCase.execute.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: 'Test',
      password: 'password',
      token: 'token',
      refreshToken: 'refreshToken',
    });
    const user = await service.login({
      email: 'test@test.com',
      password: 'password',
    });
    expect(user).toBeDefined();
    expect(user).toHaveProperty('token');
    expect(user).toHaveProperty('refreshToken');
  });

  it('should throw an error if the password or email is incorrect', async () => {
    mockLoginUserUseCase.execute.mockRejectedValue(
      new UnauthorizedException('Invalid credentials'),
    );
    await expect(
      service.login({
        email: 'test@test.com',
        password: 'password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should refresh a token', async () => {
    mockRefreshTokenUseCase.execute.mockResolvedValue({
      token: 'token',
      refreshToken: 'refreshToken',
    });
    const user = await service.refreshToken('1', 'token');

    expect(user).toBeDefined();
    expect(user).toHaveProperty('token');
    expect(user).toHaveProperty('refreshToken');
  });
});
