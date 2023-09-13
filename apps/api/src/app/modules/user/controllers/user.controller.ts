import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { UserService } from '@modules/user/services/user.service';
import { UserCreateDtoV } from '@modules/user/dtov/user-create.dtov';
import { UserUpdateDtoV } from '@modules/user/dtov/user-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';

@ApiTags('users')
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
  create(@Body() data: UserCreateDtoV): Promise<User> {
    return this._userService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: UserUpdateDtoV): Promise<UpdateResult> {
    return this._userService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this._userService.delete({ _id: id });
  }
}
