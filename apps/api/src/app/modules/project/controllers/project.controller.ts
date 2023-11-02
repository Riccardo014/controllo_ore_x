import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { ProjectCreateDtoV } from '@modules/project/dtov/project-create.dtov';
import { ProjectUpdateDtoV } from '@modules/project/dtov/project-update.dtov';
import { ProjectService } from '@modules/project/services/project.service';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { ApiErrors } from '@shared/utils/errors/api-errors';
import { RoleChecker } from '@shared/utils/role-checker';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Project } from '../entities/project.entity';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private _projectService: ProjectService,
    private _userService: UserService,
  ) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<Project>> {
    return this._projectService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<Project>> {
    return this._projectService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Project> {
    return this._projectService.getOne(id, ['customer']);
  }

  @Post()
  create(
    @Body() data: ProjectCreateDtoV,
    @AuthUser() user: User,
  ): Promise<Project> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._projectService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: ProjectUpdateDtoV,
    @AuthUser() user: User,
  ): Promise<UpdateResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._projectService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResult> {
    if (!RoleChecker.isUserRoleAdminOrHigher(user, this._userService)) {
      throw new ForbiddenException(ApiErrors.UNUTHORIZED_OPERATION);
    }
    return this._projectService.delete({ _id: id });
  }
}
