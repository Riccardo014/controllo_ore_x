import { ReleaseUpdateDto } from '@api-interfaces';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReleaseUpdateDtoV implements ReleaseUpdateDto {
  @IsOptional() 
  @IsString()
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
