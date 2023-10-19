import { FILTER_TYPE, FULL_SEARCH_COLUMN_TYPE } from '@api-interfaces';
import { COLUMN_TYPE } from '../enums/column-type.enum';

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
  fullSearchCols?: (
    | string
    | { type: FULL_SEARCH_COLUMN_TYPE; field: string }
  )[];
}

export interface TableConfigurationColumn {
  title: string;
  field: string;
  type: COLUMN_TYPE;
  transformFn?: string;
  sortable: boolean;
}

export interface TableConfigurationFilter {
  label: string;
  field: string;
  filterType: FILTER_TYPE;
  options?: any[];
}
