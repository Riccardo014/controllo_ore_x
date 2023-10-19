import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { ReleaseCreateDtoV } from '@modules/project/dtov/release-create.dtov';
import { ReleaseUpdateDtoV } from '@modules/project/dtov/release-update.dtov';
import { ReleaseService } from '@modules/project/services/release.service';
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
import { Release } from '../entities/release.entity';

@ApiTags('Releases')
@Controller('releases')
export class ReleaseController {
  constructor(
    private _releaseService: ReleaseService,
    private _userService: UserService,
  ) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<Release>> {
    return this._releaseService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<Release>> {
    return this._releaseService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Release> {
    return this._releaseService.getOne(id);
  }

  @Post()
  create(
    @Body() data: ReleaseCreateDtoV,
    @AuthUser() user: User,
  ): Promise<Release> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._releaseService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: ReleaseUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._releaseService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._releaseService.delete({ _id: id });
  }
}
