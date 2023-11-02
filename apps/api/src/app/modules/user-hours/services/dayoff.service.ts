import { DayoffCreateDtoV } from '@modules/user-hours/dtov/dayoff-create.dtov';
import { DayoffUpdateDtoV } from '@modules/user-hours/dtov/dayoff-update.dtov';
import { Dayoff } from '@modules/user-hours/entities/dayoff.entity';
import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { EntityManager } from 'typeorm';
import { HOURS_TAG_SEED } from '../seeds/hours-tag.seed';

@Injectable()
export class DayoffService extends CrudService<
  Dayoff,
  DayoffCreateDtoV,
  DayoffUpdateDtoV
> {
  target: typeof Dayoff = Dayoff;

  create(data: DayoffCreateDtoV, TX?: EntityManager): Promise<Dayoff> {
    const newData = {
      ...data,
      hoursTagId: HOURS_TAG_SEED[0]._id,
    };
    return this.getRepository(TX).save(newData);
  }
}
