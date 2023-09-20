import { LabelCreateDto } from '@api-interfaces';
import { IsString } from 'class-validator';

export class LabelCreateDtoV implements LabelCreateDto {

  @IsString()
  name: string;

  @IsString() 
  iconName: string;

}
