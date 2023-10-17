import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { UserHoursCreateDtoV } from '@modules/user-hours/dtov/user-hours-create.dtov';
import { UserHoursUpdateDtoV } from '@modules/user-hours/dtov/user-hours-update.dtov';
import { UserHoursService } from '@modules/user-hours/services/user-hours.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserHours } from '../entities/user-hours.entity';

@ApiTags('UserHours')
@Controller('userHours')
export class UserHoursController {
  constructor(private _userHoursService: UserHoursService) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<UserHours>> {
    return this._userHoursService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<UserHours>> {
    return this._userHoursService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<UserHours> {
    return this._userHoursService.getOne(id, [
      'release',
      'user',
      'hoursTag',
      'release.project',
      'release.project.customer',
    ]);
  }

  @Post()
  create(@Body() data: UserHoursCreateDtoV): Promise<UserHours> {
    return this._userHoursService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UserHoursUpdateDtoV,
  ): Promise<UpdateResult> {
    return this._userHoursService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this._userHoursService.delete({ _id: id });
  }
}
