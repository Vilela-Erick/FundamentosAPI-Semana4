import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Registration } from './entities/registration.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { Attendee } from '../attendees/entities/attendee.entity.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    const { eventId, attendeeId } = createRegistrationDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const attendee = await this.attendeeRepository.findOne({
      where: { id: attendeeId },
    });

    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${attendeeId} not found`);
    }

    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        eventId,
        attendeeId,
      },
    });

    if (existingRegistration) {
      throw new ConflictException(
        'The attendee is already registered for this event',
      );
    }

    const registration = this.registrationRepository.create(
      createRegistrationDto,
    );

    return this.registrationRepository.save(registration);
  }

  async findAll() {
    return this.registrationRepository.find({
      relations: {
        event: true,
        attendee: true,
      },
    });
  }

  async findOne(id: number) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: {
        event: true,
        attendee: true,
      },
    });

    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    return registration;
  }
}
