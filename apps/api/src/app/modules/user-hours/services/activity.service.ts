import {
  FIND_BOOSTED_FN,
  FindBoostedOptions,
  FindBoostedResult,
} from '@api-interfaces';
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
    /**
     * Filtri disponibili solo per le userHours e non per i dayoffs
     */
    const filterFields = ['release'];

    findConditions.pagination = false;

    const activities: Activity[] = [];

    const rangeDates: {
      startDate: Date;
      endDate: Date;
    } = this._buildRangeDates(findConditions);

    const userHours = await this._userHoursService.getMany(findConditions, TX);
    for (const userHour of userHours.data) {
      activities.push(userHour);
    }

    //TODO: aggiungi i controlli per gli altri campi

    if (findConditions.where && findConditions.where[0]) {
      for (const filterField of filterFields) {
        if (findConditions.where[0][filterField]) {
          return {
            data: activities,
            pagination: {
              itemsPerPage: activities.length,
              currentPage: 1,
              totalItems: activities.length,
            },
          };
        }
      }
    }

    //Caso in cui si ha la poisibilità di avere dayoff

    const dayoffFindConditions: FindBoostedOptions =
      this._buildDayoffFindConditions(findConditions);

    const dayoffs = await this._dayoffService.getMany(dayoffFindConditions, TX);

    for (const dayoff of dayoffs.data) {
      if (dayoff.startDate.toDateString() === dayoff.endDate.toDateString()) {
        activities.push(this._createActivityFromSingleDayoff(dayoff));
      } else {
        // il permesso dura più di un giorno
        const multipleDayoffActivities: Activity[] =
          this._createActivityFromMultipleDayoff(dayoff);

        const dayoffActivities: Activity[] =
          this._filterMultipleDayoffActivities(
            rangeDates,
            multipleDayoffActivities,
          );
        for (const dayoffActivity of dayoffActivities) {
          activities.push(dayoffActivity);
        }
      }
    }

    return {
      data: this._orderDayoffActivities(activities, findConditions),
      pagination: {
        itemsPerPage: activities.length,
        currentPage: 1,
        totalItems: activities.length,
      },
    };
  }

  private _buildRangeDates(findConditions: FindBoostedOptions): any {
    const dayoffWhere = !!findConditions.where ? findConditions.where : {};
    if (dayoffWhere[0] && dayoffWhere[0].date) {
      return {
        startDate: dayoffWhere[0].date.args[0],
        endDate: dayoffWhere[0].date.args[1],
      };
    }
  }

  private _buildDayoffFindConditions(
    findConditions: FindBoostedOptions,
  ): FindBoostedOptions {
    const dayoffWhere = !!findConditions.where ? findConditions.where : {};
    const dayoffWhereOptions = {};
    if (dayoffWhere[0]) {
      if (dayoffWhere[0].date) {
        dayoffWhereOptions['startDate'] = {
          _fn: FIND_BOOSTED_FN.DATE_BETWEEN,
          args: dayoffWhere[0].date.args,
        };
        dayoffWhereOptions['endDate'] = {
          _fn: FIND_BOOSTED_FN.DATE_BETWEEN,
          args: dayoffWhere[0].date.args,
        };
        dayoffWhereOptions['startDate'] = {
          _fn: FIND_BOOSTED_FN.DATE_LOWER_EQUAL,
          args: dayoffWhere[0].date.args[1],
        };
        dayoffWhereOptions['endDate'] = {
          _fn: FIND_BOOSTED_FN.DATE_GREATER_EQUAL,
          args: dayoffWhere[0].date.args[0],
        };
      }
      if (dayoffWhere[0].user) {
        dayoffWhereOptions['user'] = dayoffWhere[0].user;
      }
      if (dayoffWhere[0].hoursTag) {
        dayoffWhereOptions['hoursTag'] = dayoffWhere[0].hoursTag;
      }
    }

    const dayoffOrder = !!findConditions.order ? findConditions.order : {};
    const dayoffOrderOptions = {};

    if (dayoffOrder) {
      if (dayoffOrder['user.name']) {
        dayoffOrderOptions['user.name'] = dayoffOrder['user.name'];
      }
      if (dayoffOrder['user.surname']) {
        dayoffOrderOptions['user.surname'] = dayoffOrder['user.surname'];
      }
      if (dayoffOrder['hoursTag.name']) {
        dayoffOrderOptions['hoursTag.name'] = dayoffOrder['hoursTag.name'];
      }
      if (dayoffOrder['hours']) {
        dayoffOrderOptions['hours'] = dayoffOrder['hours'];
      }
      if (dayoffOrder['notes']) {
        dayoffOrderOptions['notes'] = dayoffOrder['notes'];
      }
    }

    // costruisci tutte le altre opzioni della findboosted
    return {
      select: findConditions.select,
      relations: ['user', 'hoursTag'],
      fullSearchCols: ['notes'],
      where: [dayoffWhereOptions],
      pagination: findConditions.pagination,
      fulltextSearch: findConditions.fulltextSearch,
      order: dayoffOrderOptions,
    };
  }

  private _createActivityFromSingleDayoff(dayoff: Dayoff): Activity {
    const date: Date = new Date(dayoff.startDate);
    date.setHours(12, 0, 0, 0);
    return {
      _id: dayoff._id,
      createdAt: dayoff.createdAt,
      updatedAt: dayoff.updatedAt,
      deletedAt: dayoff.deletedAt,
      userId: dayoff.userId,
      user: dayoff.user,
      hoursTagId: dayoff.hoursTagId,
      hoursTag: dayoff.hoursTag,
      date: date,
      notes: dayoff.notes,
      hours: dayoff.hours,
    };
  }

  private _createActivityFromMultipleDayoff(dayoff: Dayoff): Activity[] {
    const currentDate = new Date(dayoff.startDate);
    const activities: Activity[] = [];

    dayoff.startDate.setHours(12, 0, 0, 0);
    dayoff.endDate.setHours(12, 0, 0, 0);
    currentDate.setHours(12, 0, 0, 0);

    while (currentDate <= dayoff.endDate) {
      activities.push({
        _id: dayoff._id,
        createdAt: dayoff.createdAt,
        updatedAt: dayoff.updatedAt,
        deletedAt: dayoff.deletedAt,
        userId: dayoff.userId,
        user: dayoff.user,
        hoursTagId: dayoff.hoursTagId,
        hoursTag: dayoff.hoursTag,
        date: this._calcolateDate(currentDate),
        notes: dayoff.notes,
        hours: 8.0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return activities;
  }

  private _filterMultipleDayoffActivities(
    rangeDates: {
      startDate: Date;
      endDate: Date;
    },
    multipleDayoffActivities: Activity[],
  ): Activity[] {
    const dayoffActivities: Activity[] = [];
    for (const multipleDayoffActivity of multipleDayoffActivities) {
      if (rangeDates && rangeDates.startDate && rangeDates.endDate) {
        const startDate = new Date(rangeDates.startDate);
        const endDate = new Date(rangeDates.endDate);

        startDate.setUTCHours(12, 0, 0, 0);
        endDate.setUTCHours(12, 0, 0, 0);

        if (
          multipleDayoffActivity.date >= startDate &&
          multipleDayoffActivity.date <= endDate
        ) {
          dayoffActivities.push(multipleDayoffActivity);
        }
      }
    }
    return dayoffActivities;
  }

  private _orderDayoffActivities(
    activities: Activity[],
    findConditions: FindBoostedOptions,
  ): Activity[] {
    const orderOptions = !!findConditions.order ? findConditions.order : {};

    if (orderOptions) {
      if (orderOptions['date']) {
        if (orderOptions['date'] === 'ASC') {
          activities.sort((a, b) => 0 - (a.date > b.date ? -1 : 1));
        } else if (orderOptions['date'] === 'DESC') {
          activities.sort((a, b) => 0 - (a.date > b.date ? 1 : -1));
        }
      }
      if (orderOptions['user.name']) {
        if (orderOptions['user.name'] === 'ASC') {
          activities.sort((a, b) => 0 - (a.user.name > b.user.name ? -1 : 1));
        } else if (orderOptions['user.name'] === 'DESC') {
          activities.sort((a, b) => 0 - (a.user.name > b.user.name ? 1 : -1));
        }
      }
      if (orderOptions['user.surname']) {
        if (orderOptions['user.surname'] === 'ASC') {
          activities.sort(
            (a, b) => 0 - (a.user.surname > b.user.surname ? -1 : 1),
          );
        } else if (orderOptions['user.surname'] === 'DESC') {
          activities.sort(
            (a, b) => 0 - (a.user.surname > b.user.surname ? 1 : -1),
          );
        }
      }
      if (orderOptions['hoursTag.name']) {
        if (orderOptions['hoursTag.name'] === 'ASC') {
          activities.sort(
            (a, b) => 0 - (a.hoursTag.name > b.hoursTag.name ? -1 : 1),
          );
        } else if (orderOptions['hoursTag.name'] === 'DESC') {
          activities.sort(
            (a, b) => 0 - (a.hoursTag.name > b.hoursTag.name ? 1 : -1),
          );
        }
      }
      if (orderOptions['hours']) {
        if (orderOptions['hours'] === 'ASC') {
          activities.sort((a, b) => 0 - (a.hours > b.hours ? -1 : 1));
        } else if (orderOptions['hours'] === 'DESC') {
          activities.sort((a, b) => 0 - (a.hours > b.hours ? 1 : -1));
        }
      }
      if (orderOptions['notes']) {
        if (orderOptions['notes'] === 'ASC') {
          activities.sort((a, b) => 0 - (a.notes > b.notes ? -1 : 1));
        } else if (orderOptions['notes'] === 'DESC') {
          activities.sort((a, b) => 0 - (a.notes > b.notes ? 1 : -1));
        }
      }
    }
    return activities;
  }

  private _calcolateDate(dayoffDate: Date): Date {
    const date = new Date(dayoffDate);
    date.setUTCHours(12, 0, 0, 0);
    return date;
  }
}
