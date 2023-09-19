import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { UserService } from '@modules/user/services/user.service';
import { UserCreateDtoV } from '@modules/user/dtov/user-create.dtov';
import { UserUpdateDtoV } from '@modules/user/dtov/user-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { RoleChecker } from '@shared/utils/role-checker';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { AuthUser } from '@shared/decorators/auth-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private _userService: UserService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<User>> {
    return this._userService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<User>> {
    return this._userService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this._userService.getOne(id);
  }

  @Post()
  create(@Body() data: UserCreateDtoV, @AuthUser() user: User): Promise<User> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._userService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: UserUpdateDtoV,
         @AuthUser() user: User): Promise<UpdateResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._userService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthUser() user: User): Promise<DeleteResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._userService.delete({ _id: id });
  }
}
