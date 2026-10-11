import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from './users.service.js';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => dto),
      save: vi.fn((user) =>
        Promise.resolve({
          id: 1,
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      remove: vi.fn((user) => Promise.resolve(user)),
      createQueryBuilder: vi.fn(() => ({
        addSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn(),
      })),
    };

    service = new UsersService(mockRepository);
  });

  it('debe registrar un usuario cifrando la contraseña sin exponerla en el retorno', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const result = await service.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'plainPassword123',
    });

    expect(result.name).toBe('Test User');
    expect(result.email).toBe('test@example.com');
    expect((result as any).password).toBeUndefined();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('debe lanzar ConflictException si el email ya existe', async () => {
    mockRepository.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });

    await expect(
      service.create({
        name: 'Test',
        email: 'test@example.com',
        password: 'plainPassword123',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
