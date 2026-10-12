import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttendeesController } from './attendees.controller.js';
import { AttendeesService } from './attendees.service.js';
import { Attendee } from './entities/attendee.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee]), AuthModule],
  controllers: [AttendeesController],
  providers: [AttendeesService],
})
export class AttendeesModule {}