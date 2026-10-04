import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizerDto } from './create-organizer.dto.js';

export class UpdateOrganizerDto extends PartialType(CreateOrganizerDto) {}
