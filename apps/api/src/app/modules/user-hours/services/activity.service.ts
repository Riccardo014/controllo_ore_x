import { FindBoostedOptions, FindBoostedResult } from '@api-interfaces';
import { ActivityCreateDtoV } from '@modules/user-hours/dtov/activity-create.dtov';
import { ActivityUpdateDtoV } from '@modules/user-hours/dtov/activity-update.dtov';
import { Activity } from '@modules/user-hours/entities/activity.entity';
import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { EntityManager } from 'typeorm';
import { Dayoff } from '../entities/dayoff.entity';
import { DayoffService } from './dayoff.service';
import { UserHoursService } from './user-hours.service';

@Injectable()
export class ActivityService extends CrudService<
  Activity,
  ActivityCreateDtoV,
  ActivityUpdateDtoV
> {
  target: typeof Activity = Activity;

  constructor(
    private _userHoursService: UserHoursService,
    private _dayoffService: DayoffService,
  ) {
    super();
  }

  async getMany(
    findConditions: FindBoostedOptions,
    TX?: EntityManager,
  ): Promise<FindBoostedResult<Activity>> {
    const activities: Activity[] = [];

    const dayoffs = await this._dayoffService.getMany(findConditions, TX);
    for (const dayoff of dayoffs.data) {
      activities.push(this._createActivityFromDayoff(dayoff));
    }

    const userHours = await this._userHoursService.getMany(findConditions, TX);
    for (const userHour of userHours.data) {
      activities.push(userHour);
    }

    return {
      data: activities,
      pagination: {
        itemsPerPage: -1,
        currentPage: -1,
        totalItems: activities.length,
      },
    };
  }

  private _createActivityFromDayoff(dayoff: Dayoff): Activity {
    return {
      _id: dayoff._id,
      createdAt: dayoff.createdAt,
      updatedAt: dayoff.updatedAt,
      deletedAt: dayoff.deletedAt,
      userId: dayoff.userId,
      date: this._calcolateDate(dayoff),
      notes: dayoff.notes,
      hours: dayoff.hours,
    };
  }

  private _calcolateDate(dayoff: Dayoff): Date {
    const date = new Date(dayoff.startDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
