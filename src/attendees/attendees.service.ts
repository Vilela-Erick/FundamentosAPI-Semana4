import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendee } from './entities/attendee.entity.js';
import { CreateAttendeeDto } from './dto/create-attendee.dto.js';
import { UpdateAttendeeDto } from './dto/update-attendee.dto.js';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  async create(createAttendeeDto: CreateAttendeeDto) {
    const existingAttendee = await this.attendeeRepository.findOne({
      where: { email: createAttendeeDto.email },
    });

    if (existingAttendee) {
      throw new ConflictException('An attendee with this email already exists');
    }

    const attendee = this.attendeeRepository.create(createAttendeeDto);

    return this.attendeeRepository.save(attendee);
  }

  async findAll() {
    return this.attendeeRepository.find({
      relations: {
        registrations: true,
      },
    });
  }

  async findOne(id: number) {
    const attendee = await this.attendeeRepository.findOne({
      where: { id },
      relations: {
        registrations: true,
      },
    });

    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${id} not found`);
    }

    return attendee;
  }

  async update(id: number, updateAttendeeDto: UpdateAttendeeDto) {
    const attendee = await this.findOne(id);

    if (updateAttendeeDto.email && updateAttendeeDto.email !== attendee.email) {
      const existingAttendee = await this.attendeeRepository.findOne({
        where: { email: updateAttendeeDto.email },
      });

      if (existingAttendee) {
        throw new ConflictException(
          'An attendee with this email already exists',
        );
      }
    }

    Object.assign(attendee, updateAttendeeDto);

    return this.attendeeRepository.save(attendee);
  }

  async remove(id: number) {
    const attendee = await this.findOne(id);

    await this.attendeeRepository.remove(attendee);

    return {
      message: `Attendee with ID ${id} deleted successfully`,
    };
  }
}
