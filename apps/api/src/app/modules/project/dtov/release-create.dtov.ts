import { ReleaseCreateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReleaseCreateDtoV implements ReleaseCreateDto {
  @IsString()
  projectId: string;
  
  @IsString()
  version: string;

  @IsOptional()
  @IsNumber()
  hoursBudget: number;

  @IsOptional()
  @IsNumber()
  billableHoursBudget: number;

  @IsOptional()
  @IsDate()
  expirationDate: Date;

}
