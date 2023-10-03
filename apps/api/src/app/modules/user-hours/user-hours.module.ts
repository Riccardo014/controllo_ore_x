import { HoursTagController } from '@modules/user-hours/controllers/hours-tag.controller';
import { UserHoursController } from '@modules/user-hours/controllers/user-hours.controller';
import { HoursTag } from '@modules/user-hours/entities/hours-tag.entity';
import { UserHours } from '@modules/user-hours/entities/user-hours.entity';
import { HoursTagService } from '@modules/user-hours/services/hours-tag.service';
import { UserHoursService } from '@modules/user-hours/services/user-hours.service';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserHours, HoursTag]), UserModule],
  controllers: [UserHoursController, HoursTagController],
  exports: [UserHoursService, HoursTagService],
  providers: [UserHoursService, HoursTagService],
})
export class UserHoursModule {}
