import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organizer } from './entities/organizer.entity.js';
import { CreateOrganizerDto } from './dto/create-organizer.dto.js';
import { UpdateOrganizerDto } from './dto/update-organizer.dto.js';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
  ) {}

  async create(createOrganizerDto: CreateOrganizerDto) {
    const existingOrganizer = await this.organizerRepository.findOne({
      where: { email: createOrganizerDto.email },
    });

    if (existingOrganizer) {
      throw new ConflictException(
        'An organizer with this email already exists',
      );
    }

    const organizer = this.organizerRepository.create(createOrganizerDto);

    return this.organizerRepository.save(organizer);
  }

  async findAll() {
    return this.organizerRepository.find({
      relations: {
        events: true,
      },
    });
  }

  async findOne(id: number) {
    const organizer = await this.organizerRepository.findOne({
      where: { id },
      relations: {
        events: true,
      },
    });

    if (!organizer) {
      throw new NotFoundException(`Organizer with ID ${id} not found`);
    }

    return organizer;
  }

  async update(id: number, updateOrganizerDto: UpdateOrganizerDto) {
    const organizer = await this.findOne(id);

    if (
      updateOrganizerDto.email &&
      updateOrganizerDto.email !== organizer.email
    ) {
      const existingOrganizer = await this.organizerRepository.findOne({
        where: { email: updateOrganizerDto.email },
      });

      if (existingOrganizer) {
        throw new ConflictException(
          'An organizer with this email already exists',
        );
      }
    }

    Object.assign(organizer, updateOrganizerDto);

    return this.organizerRepository.save(organizer);
  }

  async remove(id: number) {
    const organizer = await this.findOne(id);

    await this.organizerRepository.remove(organizer);

    return {
      message: `Organizer with ID ${id} deleted successfully`,
    };
  }
}
