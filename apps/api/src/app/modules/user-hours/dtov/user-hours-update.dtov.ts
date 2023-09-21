import { UserHoursUpdateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserHoursUpdateDtoV implements UserHoursUpdateDto {
  @IsOptional() 
  @IsUUID()
  userId?: string;

  @IsOptional() 
  @IsUUID()
  releaseId?: string;

  @IsOptional() 
  @IsUUID()
  labelId?: string;

  @IsOptional() 
  @IsDate()
  date?: Date;

  @IsOptional() 
  @IsString()
  notes?: string;

  @IsOptional() 
  @IsNumber()
  hours?: number;
}
