import { IConfigSeed } from './interfaces/i-config-seed';
import { CUSTOMER_INDEX_CONFIGURATION_SEED } from './partials/customer-index-configuration.seed';
import { PROJECT_INDEX_CONFIGURATION_SEED } from './partials/project-index-configuration.seed';
import { TEAM_INDEX_CONFIGURATION_SEED } from './partials/team-index-configuration.seed';

export const INDEX_CONFIGURATION_SEED: IConfigSeed[] = [
  TEAM_INDEX_CONFIGURATION_SEED,
  CUSTOMER_INDEX_CONFIGURATION_SEED,
  PROJECT_INDEX_CONFIGURATION_SEED,
];
