import { IndexConfigurationController } from '@modules/index-configuration/index-configuration.controller';
import { IndexConfiguration } from '@modules/index-configuration/index-configuration.entity';
import { IndexConfigurationService } from '@modules/index-configuration/index-configuration.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IndexConfiguration])],
  controllers: [IndexConfigurationController],
  providers: [IndexConfigurationService],
})
export class IndexConfigurationModule {
  constructor(
    private _configService: ConfigService,
    private _indexConfigSvc: IndexConfigurationService,
  ) {
    if (
      this._configService.get<'true' | 'false'>('SEED_DATA_ACTIVE', 'false') ===
      'true'
    ) {
      this._indexConfigSvc.seed();
    }
  }
}
