import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions, ROLE } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { UpdateResult } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleUpdateDtoV } from '../dtov/role-update.dtov';
import { RoleService } from '../services/role.service';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { User } from '../entities/user.entity';
import { RoleChecker } from '@shared/utils/role-checker';
import { UserService } from '../services/user.service';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private _roleService: RoleService, private _userService: UserService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: FindBoostedOptions): Promise<FindBoostedResult<Role>> {
    return this._roleService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<Role>> {
    return this._roleService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Role> {
    return this._roleService.getOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: RoleUpdateDtoV): Promise<UpdateResult> {
    return this._roleService.update(id, body);
  }

  @Get('roleId/:name')
  getRoleIdByName(@Param('name') name: string, @AuthUser() user: User): string {
    const permittedRoles = [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.COLLABORATOR];
    if(!RoleChecker.checkPermission(user, this._userService, permittedRoles)){
      throw new ForbiddenException();
    }
    return 'All good';
  }

}
