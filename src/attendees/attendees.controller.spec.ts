import { Test, TestingModule } from '@nestjs/testing';
import { AttendeesController } from './attendees.controller.js';
import { AttendeesService } from './attendees.service.js';

describe('AttendeesController', () => {
  let controller: AttendeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendeesController],
      providers: [
        {
          provide: AttendeesService,
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

    controller = module.get<AttendeesController>(AttendeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
