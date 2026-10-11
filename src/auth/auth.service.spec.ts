import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;

  beforeEach(() => {
    mockUsersService = {
      create: vi.fn(),
      findByEmailWithPassword: vi.fn(),
      findById: vi.fn(),
    };
    mockJwtService = {
      sign: vi.fn().mockReturnValue('mocked.jwt.token'),
    };
    authService = new AuthService(mockUsersService, mockJwtService);
  });

  it('debe registrar un usuario y retornar token sin exponer contraseña', async () => {
    mockUsersService.create.mockResolvedValue({
      id: 1,
      name: 'User 1',
      email: 'user1@test.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.register({
      name: 'User 1',
      email: 'user1@test.com',
      password: 'mypassword',
    });

    expect(result.access_token).toBe('mocked.jwt.token');
    expect(result.user.email).toBe('user1@test.com');
    expect((result.user as any).password).toBeUndefined();
  });

  it('debe iniciar sesión con credenciales correctas', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    mockUsersService.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      name: 'User 1',
      email: 'user1@test.com',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.login({
      email: 'user1@test.com',
      password: 'correctPassword',
    });

    expect(result.access_token).toBe('mocked.jwt.token');
    expect((result.user as any).password).toBeUndefined();
  });

  it('debe lanzar UnauthorizedException ante contraseña incorrecta', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    mockUsersService.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      name: 'User 1',
      email: 'user1@test.com',
      password: hashedPassword,
    });

    await expect(
      authService.login({
        email: 'user1@test.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
