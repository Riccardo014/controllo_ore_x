import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { HoursExtraService } from '@modules/project/services/hours-extra.service';
import { HoursExtraCreateDtoV } from '@modules/project/dtov/hours-extra-create.dtov';
import { HoursExtraUpdateDtoV } from '@modules/project/dtov/hours-extra-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { HoursExtra } from '../entities/hours-extra.entity';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { RoleChecker } from '@shared/utils/role-checker';

@ApiTags('HoursExtras')
@Controller('hoursExtras')
export class HoursExtraController {
  constructor(private _hoursExtraService: HoursExtraService, private _userService: UserService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<HoursExtra>> {
    return this._hoursExtraService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<HoursExtra>> {
    return this._hoursExtraService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<HoursExtra> {
    return this._hoursExtraService.getOne(id);
  }

  @Post()
  create(@Body() data: HoursExtraCreateDtoV, @AuthUser() user: User): Promise<HoursExtra> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._hoursExtraService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: HoursExtraUpdateDtoV,
         @AuthUser() user: User): Promise<UpdateResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._hoursExtraService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthUser() user: User): Promise<DeleteResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._hoursExtraService.delete({ _id: id });
  }
}
