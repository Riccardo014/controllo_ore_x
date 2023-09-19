import { CustomerUpdateDto } from '@api-interfaces';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CustomerUpdateDtoV implements CustomerUpdateDto {
  @IsOptional() 
  @IsEmail() 
  email?: string;

  @IsOptional() 
  @IsString() 
  name?: string;

  //TODO: avatar
}