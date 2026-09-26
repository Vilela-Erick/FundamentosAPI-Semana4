import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}