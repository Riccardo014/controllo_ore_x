import { CustomerCreateDto } from '@api-interfaces';
import { IsEmail, IsString } from 'class-validator';

export class CustomerCreateDtoV implements CustomerCreateDto {

  @IsEmail() 
  email: string;

  @IsString() 
  name: string;

  //TODO: avatar

}