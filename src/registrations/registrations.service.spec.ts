import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegistrationsService } from './registrations.service.js';
import { Registration } from './entities/registration.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { Attendee } from '../attendees/entities/attendee.entity.js';

describe('RegistrationsService', () => {
  let service: RegistrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationsService,
        {
          provide: getRepositoryToken(Registration),
          useValue: {
            find: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            remove: vi.fn(),
          },
        },
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOne: vi.fn(),
          },
        },
        {
          provide: getRepositoryToken(Attendee),
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
