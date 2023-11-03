import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const RELEASE_HOURS_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.RELEASE_HOURS,
  configuration: {
    collectionId: 'release-hours-index',
    exportEnabled: true,
    filters: [],
    pagination: {
      disabled: true,
    },
    columns: [
      {
        title: 'Data',
        type: 'DATE',
        field: 'date',
        sortable: true,
      },
      {
        title: 'Nome',
        type: 'STRING',
        field: 'user.name',
        sortable: true,
      },
      {
        title: 'Cognome',
        type: 'STRING',
        field: 'user.surname',
        sortable: true,
      },
      {
        title: 'Etichetta',
        type: 'STRING',
        field: 'hoursTag.name',
        sortable: true,
      },
      {
        title: 'Ore',
        type: 'HOURS',
        field: 'hours',
        sortable: true,
      },
      {
        title: 'Note',
        type: 'STRING',
        field: 'notes',
        sortable: true,
      },
    ],
    relations: ['hoursTag', 'user'],
    fullSearchCols: ['notes', 'user.name', 'user.surname', 'hoursTag.name'],
  },
};
