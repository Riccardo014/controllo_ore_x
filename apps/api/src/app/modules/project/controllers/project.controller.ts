import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { ProjectService } from '@modules/project/services/project.service';
import { ProjectCreateDtoV } from '@modules/project/dtov/project-create.dtov';
import { ProjectUpdateDtoV } from '@modules/project/dtov/project-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Project } from '../entities/project.entity';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { RoleChecker } from '@shared/utils/role-checker';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private _projectService: ProjectService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<Project>> {
    return this._projectService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<Project>> {
    return this._projectService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Project> {
    return this._projectService.getOne(id);
  }

  @Post()
  create(@Body() data: ProjectCreateDtoV, @AuthUser() user: User): Promise<Project> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._projectService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: ProjectUpdateDtoV,
         @AuthUser() user: User): Promise<UpdateResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._projectService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthUser() user: User): Promise<DeleteResult> {
    if(!RoleChecker.userRoleIsAdminOrHigher(user)){
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._projectService.delete({ _id: id });
  }
}
