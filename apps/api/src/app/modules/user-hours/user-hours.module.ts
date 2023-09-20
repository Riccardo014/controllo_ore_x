import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHours } from '@modules/user-hours/entities/user-hours.entity';
import { UserHoursService } from '@modules/user-hours/services/user-hours.service';
import { UserHoursController } from '@modules/user-hours/controllers/user-hours.controller';
import { LabelController } from '@modules/user-hours/controllers/label.controller';
import { LabelService } from '@modules/user-hours/services/label.service';
import { Label } from '@modules/user-hours/entities/label.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    UserHours,
    Label,
    ]),
    UserModule,
  ],
  controllers: [
    UserHoursController,
    LabelController,
],
  exports: [
    UserHoursService,
    LabelService,
],
  providers: [
    UserHoursService,
    LabelService,
]
})
export class UserHoursModule {}
