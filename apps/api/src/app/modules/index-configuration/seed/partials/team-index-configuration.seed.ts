import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const TEAM_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.TEAM,
  configuration: {
    collectionId: 'team-index',
    exportEnabled: true,
    filters: [],
    columns: [
      {
        title: 'Nome',
        type: 'STRING',
        field: 'name',
        sortable: true,
      },
      {
        title: 'Cognome',
        type: 'STRING',
        field: 'surname',
        sortable: true,
      },
      {
        title: 'Email',
        type: 'STRING',
        field: 'email',
        sortable: true,
      },
      {
        title: 'Creazione',
        type: 'LONG_DATE',
        field: 'createdAt',
        sortable: true,
      },
      {
        title: 'Ruolo',
        type: 'ROLE',
        field: 'role.name',
        sortable: true,
      },
      {
        title: '',
        field: '',
        type: 'EDITABLE',
        sortable: false,
      },
    ],
    relations: ['role'],
    fullSearchCols: ['name', 'surname', 'email', 'role.name'],
  },
};
