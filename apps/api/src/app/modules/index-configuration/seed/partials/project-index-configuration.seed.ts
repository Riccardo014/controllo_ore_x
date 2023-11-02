import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const PROJECT_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.PROJECT,
  configuration: {
    collectionId: 'project-index',
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
        title: 'Colore',
        type: 'STRING',
        field: 'color',
        sortable: true,
      },
      {
        title: 'Budget',
        type: 'NUMBER',
        field: 'hoursBudget',
        sortable: true,
      },
      {
        title: 'Scadenza',
        type: 'DATE',
        field: 'Deadline',
        sortable: true,
      },
      {
        title: 'Cliente',
        type: 'STRING',
        field: 'customer.name',
        sortable: true,
      },
      {
        title: '',
        field: '',
        type: 'EDITABLE',
        sortable: false,
      },
    ],
    relations: ['customer'],
    fullSearchCols: ['name', 'hoursBudget', 'customer.name'],
  },
};
