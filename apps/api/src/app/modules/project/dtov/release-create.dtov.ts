import { ReleaseCreateDto } from '@api-interfaces';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReleaseCreateDtoV implements ReleaseCreateDto {
  @IsUUID()
  projectId: string;
  
  @IsString()
  version: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsOptional()
  @IsNumber()
  hoursBudget: number;

  @IsOptional()
  @IsNumber()
  billableHoursBudget: number;

  @IsOptional()
  @IsDate()
  deadline: Date;

}
