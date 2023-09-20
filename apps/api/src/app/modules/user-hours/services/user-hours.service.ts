import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { UserHours } from '@modules/user-hours/entities/user-hours.entity';
import { UserHoursCreateDtoV } from '@modules/user-hours/dtov/user-hours-create.dtov';
import { UserHoursUpdateDtoV } from '@modules/user-hours/dtov/user-hours-update.dtov';

@Injectable()
export class UserHoursService extends CrudService<UserHours, UserHoursCreateDtoV, UserHoursUpdateDtoV> {
  target: typeof UserHours = UserHours;
}
