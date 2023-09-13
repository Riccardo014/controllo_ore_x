import { UserUpdateDto } from '@api-interfaces';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserUpdateDtoV implements UserUpdateDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() surname?: string;
  //TODO: avatar
}