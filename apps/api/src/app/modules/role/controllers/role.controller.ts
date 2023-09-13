import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { RoleService } from '@modules/role/services/role.service';
import { RoleUpdateDtoV } from '@modules/role/dtov/role-update.dtov';
import { UpdateResult } from 'typeorm';
import { Role } from '../entities/role.entity';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private _roleService: RoleService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<Role>> {
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

}
