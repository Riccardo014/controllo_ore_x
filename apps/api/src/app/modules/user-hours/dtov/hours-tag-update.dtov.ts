import { HoursTagUpdateDto } from '@api-interfaces';
import { IsOptional, IsString } from 'class-validator';

export class HoursTagUpdateDtoV implements HoursTagUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  iconName: string;
}
