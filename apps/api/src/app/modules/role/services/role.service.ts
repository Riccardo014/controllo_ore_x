import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Role } from '@modules/role/entities/role.entity';
import { RoleCreateDtoV } from '@modules/role/dtov/role-create.dtov';
import { RoleUpdateDtoV } from '@modules/role/dtov/role-update.dtov';

@Injectable()
export class RoleService extends CrudService<Role, RoleCreateDtoV, RoleUpdateDtoV> {
  target: typeof Role = Role;
}
