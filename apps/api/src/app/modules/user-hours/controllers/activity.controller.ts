import { ActivityReadDto, FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { ActivityService } from '@modules/user-hours/services/activity.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private _activityService: ActivityService) {}

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<ActivityReadDto>> {
    return this._activityService.getMany(body);
  }
}
