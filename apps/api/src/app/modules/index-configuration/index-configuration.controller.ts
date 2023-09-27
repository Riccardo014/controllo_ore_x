import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';
import { IndexConfiguration } from '@modules/index-configuration/index-configuration.entity';
import { IndexConfigurationService } from '@modules/index-configuration/index-configuration.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('index-configurations')
@ApiBearerAuth()
@ApiTags('Index Configuration')
export class IndexConfigurationController {
  constructor(private _indexConfigurationSvc: IndexConfigurationService) {}

  @Get(':key')
  getConfiguration(@Param('key') key: INDEX_CONFIGURATION_KEY): Promise<IndexConfiguration> {
    return this._indexConfigurationSvc.findOne(key);
  }
}

