import { ReleaseExtraHoursCreateDto } from '@api-interfaces';
import { IsNumber, IsString } from 'class-validator';

export class ReleaseExtraHoursCreateDtoV implements ReleaseExtraHoursCreateDto {

  @IsNumber()
  hours: number;

  @IsString()
  notes: string;
  
  @IsString()
  referent: string;

}
