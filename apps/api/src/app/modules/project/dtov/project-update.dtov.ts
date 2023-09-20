import { ProjectUpdateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProjectUpdateDtoV implements ProjectUpdateDto {
  @IsOptional() 
  @IsString() 
  name?: string;

  @IsOptional() 
  @IsUUID()
  customerId?: string;

  @IsOptional() 
  @IsString() 
  color?: string;

  @IsOptional() 
  @IsNumber() 
  hoursBudget?: number;

  @IsOptional() 
  @IsDate() 
  expirationDate?: Date;

}
