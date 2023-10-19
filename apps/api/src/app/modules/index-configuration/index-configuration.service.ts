import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';
import { IndexConfiguration } from '@modules/index-configuration/index-configuration.entity';
import { INDEX_CONFIGURATION_SEED } from '@modules/index-configuration/seed';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class IndexConfigurationService {
  constructor(
    private _dataSource: DataSource,
    @InjectRepository(IndexConfiguration)
    private _indexConfigRepository: Repository<IndexConfiguration>
  ) {}

  async findOne(key: INDEX_CONFIGURATION_KEY): Promise<IndexConfiguration> {
    return this._indexConfigRepository.findOne({ where: { key } });
  }

  async seed(): Promise<void> {
    await this._dataSource.transaction(async (TX) => {
      Logger.debug('[INDEX CONFIGURATION SEED] Start seeding process...');
      for (const config of INDEX_CONFIGURATION_SEED) {
        Logger.debug('[INDEX CONFIGURATION SEED] Seeding key: ' + config.key);
        const configForRole: IndexConfiguration = await TX.getRepository(IndexConfiguration).findOne({
          where: {
            key: config.key,
          },
        });
        if (configForRole) {
          configForRole.configuration = config.configuration;
          await TX.getRepository(IndexConfiguration).save(configForRole);
        } else {
          await TX.getRepository(IndexConfiguration).save(config);
        }
      }
      Logger.debug('[INDEX CONFIGURATION SEED] Seeding process ended!');
    });
  }
}

