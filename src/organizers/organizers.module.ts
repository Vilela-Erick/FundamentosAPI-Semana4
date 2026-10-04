import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizersController } from './organizers.controller.js';
import { OrganizersService } from './organizers.service.js';
import { Organizer } from './entities/organizer.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer])],
  controllers: [OrganizersController],
  providers: [OrganizersService],
})
export class OrganizersModule {}
