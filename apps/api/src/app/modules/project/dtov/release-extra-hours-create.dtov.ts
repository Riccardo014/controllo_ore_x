import { ReleaseExtraHoursCreateDto } from '@api-interfaces';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReleaseExtraHoursCreateDtoV implements ReleaseExtraHoursCreateDto {

  @IsNumber()
  hours: number;

  @IsString()
  notes: string;
  
  @IsOptional()
  @IsString()
  referent: string;

  @IsUUID()
  releaseId: string;

}
