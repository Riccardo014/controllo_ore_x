import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@modules/project/entities/project.entity';
import { ProjectService } from '@modules/project/services/project.service';
import { ProjectController } from '@modules/project/controllers/project.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
    ])
  ],
  controllers: [
    ProjectController,
  ],
  exports: [
    ProjectService,
  ],
  providers: [
    ProjectService,
  ]
})
export class ProjectModule {}
