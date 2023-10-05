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
        title: 'Creazione',
        type: 'DATE',
        field: 'createdAt',
        sortable: true,
      },
      {
        title: 'Budget',
        type: 'NUMBER',
        field: 'hoursBudget',
        sortable: true,
      },
    ],
    relations: [],
    fullSearchCols: ['version'],
  },
};
