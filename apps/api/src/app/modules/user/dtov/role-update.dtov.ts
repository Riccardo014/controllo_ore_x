import { RoleUpdateDto } from '@api-interfaces';
import { IsOptional, IsString } from 'class-validator';

export class RoleUpdateDtoV implements RoleUpdateDto {
  @IsOptional() 
  @IsString() 
  permissions?: string;
  
  @IsOptional() 
  @IsString() 
  name?: string;

}