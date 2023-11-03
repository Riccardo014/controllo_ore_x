import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const PROJECT_HOURS_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.PROJECT_HOURS,
  configuration: {
    collectionId: 'project-hours-index',
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
        title: 'Release',
        type: 'STRING',
        field: 'release.name',
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
    relations: ['release', 'hoursTag', 'user'],
    fullSearchCols: [
      'release.name',
      'notes',
      'user.name',
      'user.surname',
      'hoursTag.name',
    ],
  },
};
