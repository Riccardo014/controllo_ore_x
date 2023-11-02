import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const HOURSTAG_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.HOURSTAG,
  configuration: {
    collectionId: 'hoursTag-index',
    exportEnabled: true,
    filters: [],
    columns: [
      {
        title: 'Icona',
        type: 'ICON',
        field: 'iconName',
        sortable: true,
      },
      {
        title: 'Nome',
        type: 'STRING',
        field: 'name',
        sortable: true,
      },
      {
        title: 'Creazione',
        type: 'LONG_DATE',
        field: 'createdAt',
        sortable: true,
      },
      {
        title: '',
        field: '',
        type: 'EDITABLE',
        sortable: false,
      },
    ],
    relations: [],
    fullSearchCols: ['name'],
  },
};
