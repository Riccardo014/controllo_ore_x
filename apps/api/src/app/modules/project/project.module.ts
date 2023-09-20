import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectService } from '@modules/project/services/project.service';
import { ProjectController } from '@modules/project/controllers/project.controller';
import { ReleaseExtraHoursController } from '@modules/project/controllers/release-extra-hours.controller';
import { ReleaseExtraHoursService } from '@modules/project/services/release-extra-hours.service';
import { ReleaseExtraHours } from '@modules/project/entities/release-extra-hours.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ReleaseExtraHours,
    ]),
    UserModule,
  ],
  controllers: [
    ProjectController,
    ReleaseExtraHoursController,
],
  exports: [
    ProjectService,
    ReleaseExtraHoursService,
],
  providers: [
    ProjectService,
    ReleaseExtraHoursService,
]
})
export class ProjectModule {}
