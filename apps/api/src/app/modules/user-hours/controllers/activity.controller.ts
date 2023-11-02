import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { ActivityCreateDtoV } from '@modules/user-hours/dtov/activity-create.dtov';
import { ActivityUpdateDtoV } from '@modules/user-hours/dtov/activity-update.dtov';
import { ActivityService } from '@modules/user-hours/services/activity.service';
import { User } from '@modules/user/entities/user.entity';
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
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Activity } from '../entities/activity.entity';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private _activityService: ActivityService) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<Activity>> {
    return this._activityService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<Activity>> {
    return this._activityService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Activity> {
    return this._activityService.getOne(id);
  }

  @Post()
  create(
    @Body() data: ActivityCreateDtoV,
    @AuthUser() user: User,
  ): Promise<Activity> {
    return this._activityService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: ActivityUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    return this._activityService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    return this._activityService.delete({ _id: id });
  }
}
