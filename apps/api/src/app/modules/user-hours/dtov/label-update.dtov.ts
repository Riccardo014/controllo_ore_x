import { LabelUpdateDto } from '@api-interfaces';
import { IsOptional, IsString } from 'class-validator';

export class LabelUpdateDtoV implements LabelUpdateDto {

  @IsOptional() 
  @IsString() 
  name?: string;

  @IsOptional() 
  @IsString() 
  iconName: string;

}
