import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
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

  async findAll() {
    return await this.eventRepository.find();
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