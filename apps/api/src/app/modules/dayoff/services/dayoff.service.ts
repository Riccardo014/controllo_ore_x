import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Dayoff } from '@modules/dayoff/entities/dayoff.entity';
import { DayoffCreateDtoV } from '@modules/dayoff/dtov/dayoff-create.dtov';
import { DayoffUpdateDtoV } from '@modules/dayoff/dtov/dayoff-update.dtov';

@Injectable()
export class DayoffService extends CrudService<Dayoff, DayoffCreateDtoV, DayoffUpdateDtoV> {
  target: typeof Dayoff = Dayoff;
}
