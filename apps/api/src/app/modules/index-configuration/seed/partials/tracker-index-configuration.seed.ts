import { INDEX_CONFIGURATION_KEY } from '@api-interfaces';

export const TRACKER_INDEX_CONFIGURATION_SEED: any = {
  key: INDEX_CONFIGURATION_KEY.TRACKER,
  configuration: {
    collectionId: 'tracker-index',
    exportEnabled: true,
    filters: [],
    columns: [
      {
        title: 'Note',
        type: 'STRING',
        field: 'notes',
        sortable: true,
      },
      {
        title: 'Ore',
        type: 'NUMBER',
        field: 'hours',
        sortable: true,
      },
      {
        title: 'Data',
        type: 'DATE',
        field: 'date',
        sortable: true,
      },
      {
        title: 'Release',
        type: 'STRING',
        field: 'release.version',
        sortable: true,
      },
      {
        title: 'TagName',
        type: 'STRING',
        field: 'hoursTag.name',
        sortable: true,
      },
      {
        title: 'TagIconName',
        type: 'STRING',
        field: 'hoursTag.iconName',
        sortable: true,
      },
      {
        title: '',
        field: '',
        type: 'EDITABLE',
        sortable: false,
      },
    ],
    relations: ['release', 'hoursTag'],
    fullSearchCols: ['notes', 'hours', 'release.version'],
  },
};
