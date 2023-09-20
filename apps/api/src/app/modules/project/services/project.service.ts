import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectCreateDtoV } from '@modules/project/dtov/project-create.dtov';
import { ProjectUpdateDtoV } from '@modules/project/dtov/project-update.dtov';

@Injectable()
export class ProjectService extends CrudService<Project, ProjectCreateDtoV, ProjectUpdateDtoV> {
  target: typeof Project = Project;
}
