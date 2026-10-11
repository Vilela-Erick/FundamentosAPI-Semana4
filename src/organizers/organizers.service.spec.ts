import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizersService } from './organizers.service.js';
import { Organizer } from './entities/organizer.entity.js';

describe('OrganizersService', () => {
  let service: OrganizersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizersService,
        {
          provide: getRepositoryToken(Organizer),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizersService>(OrganizersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
