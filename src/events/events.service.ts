import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { QueryEventsDto } from './dto/query-events.dto.js';
import { Event } from './entities/event.entity.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create(createEventDto);

    return await this.eventRepository.save(event);
  }

  async findAll(queryEventsDto: QueryEventsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      order = 'DESC',
    } = queryEventsDto;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('event.description ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('event.location ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('event.isActive = :isActive', {
        isActive,
      });
    }

    queryBuilder.orderBy(`event.${sortBy}`, order);

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException(`El evento con id ${id} no existe`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    this.eventRepository.merge(event, updateEventDto);

    return await this.eventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);

    await this.eventRepository.remove(event);
  }
}
