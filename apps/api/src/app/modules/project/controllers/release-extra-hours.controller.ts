import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { ReleaseExtraHoursCreateDtoV } from '@modules/project/dtov/release-extra-hours-create.dtov';
import { ReleaseExtraHoursUpdateDtoV } from '@modules/project/dtov/release-extra-hours-update.dtov';
import { ReleaseExtraHoursService } from '@modules/project/services/release-extra-hours.service';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { RoleChecker } from '@shared/utils/role-checker';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ReleaseExtraHours } from '../entities/release-extra-hours.entity';

@ApiTags('ReleaseExtraHours')
@Controller('releaseExtraHours')
export class ReleaseExtraHoursController {
  constructor(
    private _releaseExtraHoursService: ReleaseExtraHoursService,
    private _userService: UserService,
  ) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<ReleaseExtraHours>> {
    return this._releaseExtraHoursService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<ReleaseExtraHours>> {
    return this._releaseExtraHoursService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ReleaseExtraHours> {
    return this._releaseExtraHoursService.getOne(id);
  }

  @Post()
  create(
    @Body() data: ReleaseExtraHoursCreateDtoV,
    @AuthUser() user: User,
  ): Promise<ReleaseExtraHours> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._releaseExtraHoursService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: ReleaseExtraHoursUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._releaseExtraHoursService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._releaseExtraHoursService.delete({ _id: id });
  }
}
