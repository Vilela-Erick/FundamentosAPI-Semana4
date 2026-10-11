import { Test, TestingModule } from '@nestjs/testing';
import { OrganizersController } from './organizers.controller.js';
import { OrganizersService } from './organizers.service.js';

describe('OrganizersController', () => {
  let controller: OrganizersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizersController],
      providers: [
        {
          provide: OrganizersService,
          useValue: {
            create: vi.fn(),
            findAll: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizersController>(OrganizersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
