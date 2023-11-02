import { UserHoursCreateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class UserHoursCreateDtoV implements UserHoursCreateDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  releaseId: string;

  @IsUUID()
  hoursTagId: string;

  @IsDate()
  date: Date;

  @IsString()
  notes: string;

  @IsNumber()
  hours: number;
}
