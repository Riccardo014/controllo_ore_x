import { ActivityCreateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
export class ActivityCreateDtoV implements ActivityCreateDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  releaseId?: string;

  @IsUUID()
  hoursTagId?: string;

  @IsDate()
  date: Date;

  @IsString()
  notes: string;

  @IsNumber()
  hours: number;
}
