import { HoursTagController } from '@modules/user-hours/controllers/hours-tag.controller';
import { UserHoursController } from '@modules/user-hours/controllers/user-hours.controller';
import { HoursTag } from '@modules/user-hours/entities/hours-tag.entity';
import { UserHours } from '@modules/user-hours/entities/user-hours.entity';
import { HoursTagService } from '@modules/user-hours/services/hours-tag.service';
import { UserHoursService } from '@modules/user-hours/services/user-hours.service';
import { UserModule } from '@modules/user/user.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HOURS_TAG_SEED } from './seeds/hours-tag.seed';
import { DayoffController } from '@modules/user-hours/controllers/dayoff.controller';
import { DayoffService } from '@modules/user-hours/services/dayoff.service';
import { Dayoff } from '@modules/user-hours/entities/dayoff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHours, HoursTag, Dayoff]), UserModule],
  controllers: [UserHoursController, HoursTagController, DayoffController],
  exports: [UserHoursService, HoursTagService, DayoffService],
  providers: [UserHoursService, HoursTagService, DayoffService],
})
export class UserHoursModule {
  constructor(
    private _hoursTagService: HoursTagService,
    private _dataSource: DataSource,
    private _configService: ConfigService,
  ) {
    if (
      this._configService.get<'true' | 'false'>('SEED_DATA_ACTIVE', 'false') ===
      'true'
    ) {
      this.seedData();
    }
  }

  async seedData(): Promise<void> {
    await this.seedHoursTags();
  }

  seedHoursTags(): Promise<void> {
    Logger.log('[SEED HOURS TAG] Start seeding...');
    return this._dataSource.transaction(async (TX) => {
      for (const hoursTag of HOURS_TAG_SEED) {
        const hoursTagSaved: HoursTag = await this._hoursTagService.getOneBy(
          { name: hoursTag.name },
          [],
          TX,
        );
        if (!hoursTagSaved) {
          await this._hoursTagService.create(hoursTag, TX);
          Logger.log(`[SEED HOURS TAG] ${hoursTag.name} saved`);
        }
      }
      Logger.log('[SEED HOURS TAG] End seeding process.');
    });
  }
}
