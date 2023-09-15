import { RoleCreateDto } from '@api-interfaces';
import { IsOptional, IsString } from 'class-validator';

export class RoleCreateDtoV implements RoleCreateDto {
  @IsString() 
  name: string;

  @IsString() 
  permissions: string;

  //I permessi del ruolo sono gestiti tramite un JSON.stringify()
}
