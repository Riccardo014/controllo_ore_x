import { UserCreateDto } from '@api-interfaces';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UserCreateDtoV implements UserCreateDto {
  @IsString() email: string;
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).{8,}$/, {
    message: 'New password should contain at least 8 characters, including a number, an uppercase letter and a special character',
  })
  password: string;
  @IsString() roleId: string;
  @IsString() name: string;
  @IsString() surname: string;
  //TODO: avatar
}