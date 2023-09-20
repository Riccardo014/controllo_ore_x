import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Label } from '@modules/user-hours/entities/label.entity';
import { LabelCreateDtoV } from '@modules/user-hours/dtov/label-create.dtov';
import { LabelUpdateDtoV } from '@modules/user-hours/dtov/label-update.dtov';

@Injectable()
export class LabelService extends CrudService<Label, LabelCreateDtoV, LabelUpdateDtoV> {
  target: typeof Label = Label;
}
