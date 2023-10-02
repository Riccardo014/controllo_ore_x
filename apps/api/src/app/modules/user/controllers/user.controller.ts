import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { UserCreateDtoV } from '@modules/user/dtov/user-create.dtov';
import { UserUpdateDtoV } from '@modules/user/dtov/user-update.dtov';
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

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<User>> {
    return this._userService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<User>> {
    return this._userService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this._userService.getOne(id, ['role']);
  }

  @Post()
  create(@Body() data: UserCreateDtoV, @AuthUser() user: User): Promise<User> {
    if (!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._userService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UserUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    if (!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._userService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    if (!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._userService.delete({ _id: id });
  }
}
