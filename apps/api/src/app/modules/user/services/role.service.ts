import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Role } from '@modules/user/entities/role.entity';
import { RoleCreateDtoV } from '@modules/user/dtov/role-create.dtov';
import { RoleUpdateDtoV } from '@modules/user/dtov/role-update.dtov';

@Injectable()
export class RoleService extends CrudService<Role, RoleCreateDtoV, RoleUpdateDtoV> {
  target: typeof Role = Role;
}
