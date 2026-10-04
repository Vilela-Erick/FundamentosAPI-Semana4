import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class CreateRegistrationDto {
  @IsInt()
  @Min(1)
  eventId: number;

  @IsInt()
  @Min(1)
  attendeeId: number;

  @IsOptional()
  @IsIn(['registered', 'cancelled', 'attended'])
  status?: string;
}
