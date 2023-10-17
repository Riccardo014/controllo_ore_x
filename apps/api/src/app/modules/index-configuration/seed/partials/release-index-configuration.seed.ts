import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const RELEASE_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.RELEASE,
  configuration: {
    collectionId: 'release-index',
    exportEnabled: true,
    filters: [],
    columns: [
      {
        title: 'Versione',
        type: 'STRING',
        field: 'version',
        sortable: true,
      },
      {
        title: 'Scadenza',
        type: 'DATE',
        field: 'deadline',
        sortable: true,
      },
      {
        title: 'Budget',
        type: 'NUMBER',
        field: 'hoursBudget',
        sortable: true,
      },
    ],
    relations: ['project'],
    fullSearchCols: ['version'],
  },
};
