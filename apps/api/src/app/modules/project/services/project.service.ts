import { ReleaseCreateDto } from '@api-interfaces';
import { ProjectCreateDtoV } from '@modules/project/dtov/project-create.dtov';
import { ProjectUpdateDtoV } from '@modules/project/dtov/project-update.dtov';
import { Project } from '@modules/project/entities/project.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { EntityManager } from 'typeorm';
import { ReleaseService } from './release.service';

@Injectable()
export class ProjectService extends CrudService<
  Project,
  ProjectCreateDtoV,
  ProjectUpdateDtoV
> {
  target: typeof Project = Project;

  constructor(private _releaseService: ReleaseService) {
    super();
  }

  async create(data: ProjectCreateDtoV, TX?: EntityManager): Promise<Project> {
    return this.transactionWrap(async (TX: EntityManager) => {
      const project: Project = await super.create(data, TX);

      if (!project) {
        throw new BadRequestException(ApiErrors.PROJECT_CREATION_WENT_WRONG);
      }

      const releaseCreateData = this.formatReleaseCreateData(project);

      await this._releaseService.create(releaseCreateData, TX);

      return project;
    }, TX);
  }

  formatReleaseCreateData(project: Project): ReleaseCreateDto {
    return {
      projectId: project._id,
      version: 'Release 0.0.1',
      isCompleted: false,
      hoursBudget: project.hoursBudget,
      billableHoursBudget: project.hoursBudget,
      deadline: project.deadline,
    };
  }
}
