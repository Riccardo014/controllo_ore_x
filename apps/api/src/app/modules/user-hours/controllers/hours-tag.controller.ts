import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { HoursTagCreateDtoV } from '@modules/user-hours/dtov/hours-tag-create.dtov';
import { HoursTagUpdateDtoV } from '@modules/user-hours/dtov/hours-tag-update.dtov';
import { HoursTagService } from '@modules/user-hours/services/hours-tag.service';
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
import { HoursTag } from '../entities/hours-tag.entity';

/**
 * @description Tags are used to categorize the user's working and holidays hours.
 */
@ApiTags('HoursTags')
@Controller('hoursTags')
export class HoursTagController {
  constructor(
    private _tagService: HoursTagService,
    private _userService: UserService,
  ) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<HoursTag>> {
    return this._tagService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<HoursTag>> {
    return this._tagService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<HoursTag> {
    return this._tagService.getOne(id);
  }

  @Post()
  create(
    @Body() data: HoursTagCreateDtoV,
    @AuthUser() user: User,
  ): Promise<HoursTag> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._tagService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: HoursTagUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._tagService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._tagService.delete({ _id: id });
  }
}
