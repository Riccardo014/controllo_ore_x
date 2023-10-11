import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectCreateDtoV } from '@modules/project/dtov/project-create.dtov';
import { ProjectUpdateDtoV } from '@modules/project/dtov/project-update.dtov';
import { EntityManager } from 'typeorm';
import { ReleaseService } from './release.service';
import { ApiErrors } from '@shared/utils/errors/api-errors';

@Injectable()
export class ProjectService extends CrudService<Project, ProjectCreateDtoV, ProjectUpdateDtoV> {
  target: typeof Project = Project;

  constructor(
    private _releaseService: ReleaseService
  ) {
    super();
  }

  async create(data: ProjectCreateDtoV, TX?: EntityManager): Promise<Project> {
    return this.transactionWrap(async (TX: EntityManager) => {
      const project: Project = await super.create(data, TX);
      
      if(!project){
        throw new BadRequestException(ApiErrors.PROJECT_CREATION_WENT_WRONG);
      }

      const releaseData = {
        projectId: project._id,
        version: '0.0.1',
        isCompleted: false,
        hoursBudget: project.hoursBudget,
        billableHoursBudget: project.hoursBudget,
        deadline: project.deadline, };
        
        await this._releaseService.create( releaseData, TX );

      return project;
    }, TX);
  }

}
