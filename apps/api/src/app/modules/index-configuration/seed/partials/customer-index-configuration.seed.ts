import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const CUSTOMER_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.CUSTOMER,
  configuration: {
    collectionId: 'customer-index',
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
        title: 'Email',
        type: 'STRING',
        field: 'email',
        sortable: true,
      },
      {
        title: 'Creazione',
        type: 'DATE',
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
    fullSearchCols: ['name', 'email'],
  },
};
