import { INDEX_CONFIGURATION_KEY, TableConfiguration } from '@api-interfaces';

export interface IConfigSeed {
  key: INDEX_CONFIGURATION_KEY;
  configuration: TableConfiguration;
}
