import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendeesService } from './attendees.service.js';
import { Attendee } from './entities/attendee.entity.js';

describe('AttendeesService', () => {
  let service: AttendeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendeesService,
        {
          provide: getRepositoryToken(Attendee),
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

    service = module.get<AttendeesService>(AttendeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
