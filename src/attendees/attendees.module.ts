import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttendeesController } from './attendees.controller.js';
import { AttendeesService } from './attendees.service.js';
import { Attendee } from './entities/attendee.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [AttendeesController],
  providers: [AttendeesService],
})
export class AttendeesModule {}
