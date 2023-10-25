import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dayoff } from '@modules/dayoff/entities/dayoff.entity';
import { DayoffService } from '@modules/dayoff/services/dayoff.service';
import { DayoffController } from '@modules/dayoff/controllers/dayoff.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dayoff,
    ])
  ],
  controllers: [
    DayoffController,
  ],
  exports: [
    DayoffService,
  ],
  providers: [
    DayoffService,
  ]
})
export class DayoffModule {}