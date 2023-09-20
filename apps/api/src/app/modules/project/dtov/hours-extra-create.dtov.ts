import { HoursExtraCreateDto } from '@api-interfaces';
import { IsNumber, IsString } from 'class-validator';

export class HoursExtraCreateDtoV implements HoursExtraCreateDto {

  @IsNumber()
  hours: number;

  @IsString()
  notes: string;
  
  @IsString()
  referent: string;

}
