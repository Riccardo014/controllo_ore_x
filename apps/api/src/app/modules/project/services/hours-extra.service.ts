import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { HoursExtra } from '@modules/project/entities/hours-extra.entity';
import { HoursExtraCreateDtoV } from '@modules/project/dtov/hours-extra-create.dtov';
import { HoursExtraUpdateDtoV } from '@modules/project/dtov/hours-extra-update.dtov';

@Injectable()
export class HoursExtraService extends CrudService<HoursExtra, HoursExtraCreateDtoV, HoursExtraUpdateDtoV> {
  target: typeof HoursExtra = HoursExtra;
}
