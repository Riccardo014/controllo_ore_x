import { HoursTagCreateDto } from '@api-interfaces';
import { IsString } from 'class-validator';

export class HoursTagCreateDtoV implements HoursTagCreateDto {
  @IsString()
  name: string;

  @IsString()
  iconName: string;
}
