import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistrationsController } from './registrations.controller.js';
import { RegistrationsService } from './registrations.service.js';
import { Registration } from './entities/registration.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { Attendee } from '../attendees/entities/attendee.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Event, Attendee])],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
})
export class RegistrationsModule {}
