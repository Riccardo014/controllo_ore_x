import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const TRACKER_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.TRACKER,
  configuration: {
    collectionId: 'tracker-index',
    exportEnabled: true,
    filters: [],
    columns: [
      {
        title: 'Cliente',
        type: 'STRING',
        field: 'release.project.customer.name',
        sortable: true,
      },
      {
        title: 'Progetto',
        type: 'STRING',
        field: 'release.project.name',
        sortable: true,
      },
      {
        title: 'Release',
        type: 'STRING',
        field: 'release.version',
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
        title: 'Data',
        type: 'DATE',
        field: 'date',
        sortable: true,
      },
    ],
    relations: [
      'release',
      'hoursTag',
      'user',
      'release.project',
      'release.project.customer',
    ],
    fullSearchCols: [
      'release.project.customer.name',
      'release.project.name',
      'release.version',
      'notes',
      'user.name',
      'user.surname',
      'hoursTag.name',
    ],
  },
};
