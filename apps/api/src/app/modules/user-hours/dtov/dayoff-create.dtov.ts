import { DayoffCreateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class DayoffCreateDtoV implements DayoffCreateDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  hoursTagId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  notes: string;

  @IsNumber()
  hours: number;
}
