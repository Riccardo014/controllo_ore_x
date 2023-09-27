import { FILTER_TYPE, FULL_SEARCH_COLUMN_TYPE } from '@api-interfaces';

export interface TableConfiguration {
  collectionId: string;
  idProperty?: string;
  columns: TableConfigurationColumn[];
  filters: TableConfigurationFilter[];
  hiddenFilters?: any;
  relations?: string[];
  select?: string[];
  pagination?: {
    disabled?: boolean;
    pageSizeOptions?: number[];
  };
  exportEnabled?: boolean;
  fullSearchCols?: (string | { type: FULL_SEARCH_COLUMN_TYPE; field: string })[];
}

export interface TableConfigurationColumn {
  title: string;
  field: string;
  type: 'NUMBER' | 'STRING' | 'DATE' | 'TIME_DATE' | 'BOOLEAN' | string;
  transformFn?: string;
  sortable: boolean;
}

export interface TableConfigurationFilter {
  label: string;
  field: string;
  filterType: FILTER_TYPE;
  options?: any[];
}
