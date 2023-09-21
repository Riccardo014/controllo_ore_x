import { ReleaseExtraHoursUpdateDto } from '@api-interfaces';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsUUID()
  releaseId: string;
  
}
