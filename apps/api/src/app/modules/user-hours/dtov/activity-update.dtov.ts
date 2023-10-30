import { ActivityUpdateDto } from '@api-interfaces';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export class ActivityUpdateDtoV implements ActivityUpdateDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  releaseId?: string;

  @IsOptional()
  @IsUUID()
  tagId?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  hours?: number;
}
