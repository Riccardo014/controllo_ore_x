import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { ReleaseExtraHours } from '@modules/project/entities/release-extra-hours.entity';
import { ReleaseExtraHoursCreateDtoV } from '@modules/project/dtov/release-extra-hours-create.dtov';
import { ReleaseExtraHoursUpdateDtoV } from '@modules/project/dtov/release-extra-hours-update.dtov';

@Injectable()
export class ReleaseExtraHoursService extends CrudService<ReleaseExtraHours, ReleaseExtraHoursCreateDtoV, ReleaseExtraHoursUpdateDtoV> {
  target: typeof ReleaseExtraHours = ReleaseExtraHours;
}
