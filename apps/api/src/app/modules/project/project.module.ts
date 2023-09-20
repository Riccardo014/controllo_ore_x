import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectService } from '@modules/project/services/project.service';
import { ProjectController } from '@modules/project/controllers/project.controller';
import { UserService } from '@modules/user/services/user.service';
import { HoursExtraController } from '@modules/project/controllers/hours-extra.controller';
import { HoursExtraService } from '@modules/project/services/hours-extra.service';
import { HoursExtra } from '@modules/project/entities/hours-extra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      HoursExtra,
        ])
  ],
  controllers: [
    ProjectController,
    HoursExtraController,
],
  exports: [
    ProjectService,
    HoursExtraService,
],
  providers: [
    ProjectService,
    UserService,
    HoursExtraService,
]
})
export class ProjectModule {}
