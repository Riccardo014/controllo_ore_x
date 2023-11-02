import { FindBoostedWhereOption } from '@api-interfaces';

export interface RtTableStatus {
  fulltextSearch?: string;

  where?: FindBoostedWhereOption[] | any;
  order?: any;
  pagination?: {
    totalItems?: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
