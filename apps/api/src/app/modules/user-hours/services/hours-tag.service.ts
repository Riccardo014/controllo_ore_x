import { HoursTagCreateDtoV } from '@modules/user-hours/dtov/hours-tag-create.dtov';
import { HoursTagUpdateDtoV } from '@modules/user-hours/dtov/hours-tag-update.dtov';
import { HoursTag } from '@modules/user-hours/entities/hours-tag.entity';
import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';

@Injectable()
export class HoursTagService extends CrudService<
  HoursTag,
  HoursTagCreateDtoV,
  HoursTagUpdateDtoV
> {
  target: typeof HoursTag = HoursTag;
}
