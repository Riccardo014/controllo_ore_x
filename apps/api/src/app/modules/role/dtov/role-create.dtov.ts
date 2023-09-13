import { RoleCreateDto } from '@api-interfaces';
import { IsOptional, IsString } from 'class-validator';

export class RoleCreateDtoV implements RoleCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() permissions: string;
}
