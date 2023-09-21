import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Release } from '@modules/project/entities/release.entity';
import { ReleaseCreateDtoV } from '@modules/project/dtov/release-create.dtov';
import { ReleaseUpdateDtoV } from '@modules/project/dtov/release-update.dtov';

@Injectable()
export class ReleaseService extends CrudService<Release, ReleaseCreateDtoV, ReleaseUpdateDtoV> {
  target: typeof Release = Release;
}
