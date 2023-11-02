import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const DAYOFF_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.DAYOFF,
  configuration: {
    collectionId: 'dayoff-index',
    exportEnabled: true,
    filters: [],
    pagination: {
      disabled: true,
    },
    columns: [
      {
        title: 'Data da',
        type: 'DATE',
        field: 'startDate',
        sortable: true,
      },
      {
        title: 'Data a',
        type: 'DATE',
        field: 'endDate',
        sortable: true,
      },
      {
        title: 'Ora inizio',
        type: 'TIME',
        field: 'startDate',
        sortable: true,
      },
      {
        title: 'Ora fine',
        type: 'TIME',
        field: 'endDate',
        sortable: true,
      },
      {
        title: 'Totale ore',
        type: 'NUMBER',
        field: 'hours',
        sortable: true,
      },
      {
        title: 'Note',
        type: 'STRING',
        field: 'notes',
        sortable: true,
      },
      {
        title: '',
        field: '',
        type: 'EDITABLE',
        sortable: false,
      },
    ],
    relations: ['user', 'hoursTag'],
    fullSearchCols: ['notes'],
  },
};
