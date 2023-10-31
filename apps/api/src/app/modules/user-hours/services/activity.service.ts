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
    /**
     * Filtri disponibili solo per le userHours e non per i dayoffs
     */
    // forse è da aggiungere hoursTag
    const filterFields = [
      'release.project',
      'release',
      'release.project.customer',
    ];

    findConditions.pagination = false;

    const activities: Activity[] = [];

    const userHours = await this._userHoursService.getMany(findConditions, TX);
    for (const userHour of userHours.data) {
      activities.push(userHour);
    }

    //TODO: aggiungi i controlli per gli altri campi
    if (findConditions.where && findConditions.where[0]) {
      if (findConditions.where[0].release) {
        return {
          data: activities,
          pagination: {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: activities.length,
          },
        };
      }
    }

    //Caso in cui si ha la poisibilità di avere dayoff

    const dayoffFindConditions: FindBoostedOptions =
      this._buildDayoffFindConditions(findConditions);

    const dayoffs = await this._dayoffService.getMany(dayoffFindConditions, TX);

    for (const dayoff of dayoffs.data) {
      activities.push(this._createActivityFromDayoff(dayoff));
    }

    //TODO: sistema pagination
    return {
      data: activities,
      pagination: {
        itemsPerPage: 10,
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
        dayoffWhereOptions['startDate'] = dayoffWhere[0].date;
      }
      if (dayoffWhere[0].user) {
        dayoffWhereOptions['user'] = dayoffWhere[0].user;
      }
    }

    // costruisci tutte le altre opzioni della findboosted
    return {
      relations: ['user'],
      fullSearchCols: ['notes'],
      where: [dayoffWhereOptions],
      pagination: findConditions.pagination,
      fulltextSearch: findConditions.fulltextSearch,
    };
  }

  private _createActivityFromDayoff(dayoff: Dayoff): Activity {
    return {
      _id: dayoff._id,
      createdAt: dayoff.createdAt,
      updatedAt: dayoff.updatedAt,
      deletedAt: dayoff.deletedAt,
      userId: dayoff.userId,
      user: dayoff.user,
      date: this._calcolateDate(dayoff),
      notes: dayoff.notes,
      hours: dayoff.hours,
    };
  }

  private _calcolateDate(dayoff: Dayoff): Date {
    //TODO: set della data dividendo i dayoffs per i giorni in cui è attivo in caso di giorni multipli
    const date = new Date(dayoff.startDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
