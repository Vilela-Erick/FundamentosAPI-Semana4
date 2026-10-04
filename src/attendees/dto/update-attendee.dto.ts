import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendeeDto } from './create-attendee.dto.js';

export class UpdateAttendeeDto extends PartialType(CreateAttendeeDto) {}
