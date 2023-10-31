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
    const filterFields = ['release', 'hoursTag'];

    findConditions.pagination = false;

    const activities: Activity[] = [];

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

        for (const multipleDayoffActivity of multipleDayoffActivities) {
          if (
            dayoffFindConditions.where[0].startDate &&
            dayoffFindConditions.where[0].endDate
          ) {
            const startDate = new Date(
              dayoffFindConditions.where[0].startDate.args,
            );
            startDate.setHours(12, 0, 0, 0);
            console.log(multipleDayoffActivity.date, startDate);
            console.log(multipleDayoffActivity.date >= startDate);
            if (multipleDayoffActivity.date >= startDate) {
              activities.push(multipleDayoffActivity);
            }
          }
        }
      }
    }

    return {
      data: activities,
      pagination: {
        itemsPerPage: activities.length,
        currentPage: 1,
        totalItems: activities.length,
      },
    };

    //   const dayoffWhere = !!findConditions.where ? findConditions.where : {};
    //   const dayoffFulltextSearch = !!findConditions.fulltextSearch
    //     ? findConditions.fulltextSearch
    //     : null;

    //   let dayoffWhereOptions = {};

    //   if (dayoffWhere.date) {
    //     dayoffWhereOptions = {
    //       startDate: dayoffWhere.date,
    //     };
    //   }
    //   if (dayoffWhere.user) {
    //     dayoffWhereOptions = {
    //       user: dayoffWhere.user,
    //     };
    //   }

    //   if (dayoffWhere[0]) {
    //     if (dayoffWhere[0].date) {
    //       dayoffWhereOptions['startDate'] = dayoffWhere[0].date;
    //     }
    //     if (dayoffWhere[0].user) {
    //       dayoffWhereOptions['user'] = dayoffWhere[0].user;
    //     }
    //   }

    //   // const dayoffFindConditions: FindBoostedOptions = {
    //   //   relations: ['user'],
    //   //   fullSearchCols: ['notes'],
    //   //   where: [dayoffWhereOptions],
    //   //   pagination: false,
    //   //   fulltextSearch: dayoffFulltextSearch,
    //   // };

    //   const dayoffs = await this._dayoffService.getMany(dayoffFindConditions, TX);

    //   for (const dayoff of dayoffs.data) {
    //     activities.push(this._createActivityFromDayoff(dayoff));
    //   }

    //   return {
    //     data: activities,
    //     //TODO: sistema pagination
    //     pagination: {
    //       itemsPerPage: 10,
    //       currentPage: 1,
    //       totalItems: activities.length,
    //     },
    //   };
  }

  private _buildDayoffFindConditions(
    findConditions: FindBoostedOptions,
  ): FindBoostedOptions {
    const dayoffWhere = !!findConditions.where ? findConditions.where : {};
    const dayoffWhereOptions = {};
    if (dayoffWhere[0]) {
      if (dayoffWhere[0].date) {
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
    }

    // costruisci tutte le altre opzioni della findboosted
    return {
      select: findConditions.select,
      relations: ['user'],
      fullSearchCols: ['notes'],
      where: [dayoffWhereOptions],
      pagination: findConditions.pagination,
      fulltextSearch: findConditions.fulltextSearch,
      order: findConditions.order,
    };
  }

  private _createActivityFromSingleDayoff(dayoff: Dayoff): Activity {
    return {
      _id: dayoff._id,
      createdAt: dayoff.createdAt,
      updatedAt: dayoff.updatedAt,
      deletedAt: dayoff.deletedAt,
      userId: dayoff.userId,
      user: dayoff.user,
      date: this._calcolateDate(dayoff.startDate),
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
        date: this._calcolateDate(currentDate),
        notes: dayoff.notes,
        hours: 8,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return activities;
  }

  private _calcolateDate(dayoffDate: Date): Date {
    //TODO: set della data dividendo i dayoffs per i giorni in cui è attivo in caso di giorni multipli
    const date = new Date(dayoffDate);
    date.setHours(12);
    return date;
  }
}
