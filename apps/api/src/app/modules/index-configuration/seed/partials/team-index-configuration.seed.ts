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
        title: 'Ruolo',
        type: 'STRING',
        field: 'role.name',
        sortable: true,
      },
      {
        title: 'Data Creazione',
        type: 'DATE',
        field: 'createdAt',
        sortable: true,
      },
    ],
    relations: ['role'],
    fullSearchCols: ['name', 'surname', 'email', 'role.name'],
  },
};
