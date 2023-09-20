import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectService } from '@modules/project/services/project.service';
import { ProjectController } from '@modules/project/controllers/project.controller';
import { HoursExtraController } from '@modules/project/controllers/hours-extra.controller';
import { HoursExtraService } from '@modules/project/services/hours-extra.service';
import { HoursExtra } from '@modules/project/entities/hours-extra.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      HoursExtra,
    ]),
    UserModule,
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
    HoursExtraService,
]
})
export class ProjectModule {}
