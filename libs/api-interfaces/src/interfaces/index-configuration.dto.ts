import { INDEX_CONFIGURATION_KEY, TableConfiguration } from '@api-interfaces';

export interface IndexConfigurationReadDto {
  _id: string;
  key: INDEX_CONFIGURATION_KEY;
  configuration: TableConfiguration;
}
