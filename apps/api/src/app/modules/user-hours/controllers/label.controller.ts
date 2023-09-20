import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { LabelService } from '@modules/user-hours/services/label.service';
import { LabelCreateDtoV } from '@modules/user-hours/dtov/label-create.dtov';
import { LabelUpdateDtoV } from '@modules/user-hours/dtov/label-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Label } from '../entities/label.entity';
import { UserService } from '@modules/user/services/user.service';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { RoleChecker } from '@shared/utils/role-checker';

/**
 * @description The labels are used to categorize the user hours.
 */
@ApiTags('Labels')
@Controller('labels')
export class LabelController {
  constructor(private _labelService: LabelService, private _userService: UserService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<Label>> {
    return this._labelService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<Label>> {
    return this._labelService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Label> {
    return this._labelService.getOne(id);
  }

  @Post()
  create(@Body() data: LabelCreateDtoV, @AuthUser() user: User): Promise<Label> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._labelService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: LabelUpdateDtoV,
         @AuthUser() user: User): Promise<UpdateResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._labelService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthUser() user: User): Promise<DeleteResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user, this._userService)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._labelService.delete({ _id: id });
  }
}
