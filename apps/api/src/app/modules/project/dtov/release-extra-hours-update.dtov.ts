import { ReleaseExtraHoursUpdateDto } from '@api-interfaces';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReleaseExtraHoursUpdateDtoV implements ReleaseExtraHoursUpdateDto {

  @IsOptional()
  @IsNumber()
  hours: number;

  @IsOptional()
  @IsString()
  notes: string;
  
  @IsOptional()
  @IsString()
  referent: string;
  
  @IsOptional()
  @IsString()
  releaseId: string;
  
}
