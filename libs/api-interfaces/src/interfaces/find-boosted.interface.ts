export interface FindBoostedOptions {
  relations?: string[];
  fullSearchCols?: (string | { type: FULL_SEARCH_COLUMN_TYPE; field: string })[];
  fulltextSearch?: string;
  where?: FindBoostedWhereOption | FindBoostedWhereOption[] | any;
  order?: FindBoostedOrder;
  pagination?: FindBoostedPagination | false;
  select?: string[];
  logging?: boolean;
}

export interface FindBoostedCondition {
  _fn: FIND_BOOSTED_FN;
  args?: any | any[];
}

export interface FindBoostedWhereOption {
  [key: string]: any | FindBoostedCondition | string | number;
}

export interface FindBoostedPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems?: number;
}

export interface FindBoostedOrder {
  [key: string]: 'ASC' | 'DESC';
}

export enum FIND_BOOSTED_FN {
  IS_NULL = 1,
  IS_NOT_NULL,

  BOOLEAN_EQUAL,
  BOOLEAN_NOT_EQUAL,

  NUMBER_BETWEEN,
  NUMBER_IN,
  NUMBER_NOT_IN,
  NUMBER_GREATER,
  NUMBER_GREATER_EQUAL,
  NUMBER_LOWER,
  NUMBER_LOWER_EQUAL,
  NUMBER_EQUAL,
  NUMBER_NOT_EQUAL,

  STRING_IN,
  STRING_NOT_IN,
  STRING_LIKE,

  DATE_BETWEEN,
  DATE_EQUAL,
  DATE_IN,
  DATE_NOT_IN,
  DATE_GREATER,
  DATE_GREATER_EQUAL,
  DATE_LOWER,
  DATE_LOWER_EQUAL,
  STRING_NOT_EQUAL_OR_NULL,
}

export enum FULL_SEARCH_COLUMN_TYPE {
  STRING,
  NUMBER,
}
