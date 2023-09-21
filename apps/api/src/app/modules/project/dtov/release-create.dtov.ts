import { ReleaseCreateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReleaseCreateDtoV implements ReleaseCreateDto {
  @IsUUID()
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
