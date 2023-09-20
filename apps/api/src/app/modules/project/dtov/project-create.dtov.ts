import { ProjectCreateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProjectCreateDtoV implements ProjectCreateDto {
  @IsString()
  name: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsNumber()
  hoursBudget: number;

  @IsOptional()
  @IsDate()
  expirationDate: Date;
}
