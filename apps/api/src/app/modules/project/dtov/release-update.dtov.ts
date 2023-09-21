import { ReleaseUpdateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReleaseUpdateDtoV implements ReleaseUpdateDto {
  @IsOptional() 
  @IsUUID()
  projectId: string;
  
  @IsOptional() 
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
