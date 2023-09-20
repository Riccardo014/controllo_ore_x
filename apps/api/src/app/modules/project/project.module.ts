import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectService } from '@modules/project/services/project.service';
import { ProjectController } from '@modules/project/controllers/project.controller';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/services/user.service';
import { HoursExtraController } from '@modules/project/controllers/hours-extra.controller';
import { HoursExtraService } from '@modules/project/services/hours-extra.service';
import { HoursExtra } from '@modules/project/entities/hours-extra.entity';
import { ReleaseExtraHoursController } from '@modules/project/controllers/release-extra-hours.controller';
import { ReleaseExtraHoursService } from '@modules/project/services/release-extra-hours.service';
import { ReleaseExtraHours } from '@modules/project/entities/release-extra-hours.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, HoursExtra, ReleaseExtraHours]),
    UserModule,
  ],
  controllers: [ProjectController, ReleaseExtraHoursController],
  exports: [ProjectService, ReleaseExtraHoursService],
  providers: [
    ProjectService,
    UserService,
    HoursExtraService,
    ReleaseExtraHoursService,
  ],
})
export class ProjectModule {}
