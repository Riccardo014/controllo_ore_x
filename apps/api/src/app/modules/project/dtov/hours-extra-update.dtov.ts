import { HoursExtraUpdateDto } from '@api-interfaces';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HoursExtraUpdateDtoV implements HoursExtraUpdateDto {

  @IsOptional()
  @IsNumber()
  hours: number;

  @IsOptional()
  @IsString()
  notes: string;
  
  @IsOptional()
  @IsString()
  referent: string;
  
}
