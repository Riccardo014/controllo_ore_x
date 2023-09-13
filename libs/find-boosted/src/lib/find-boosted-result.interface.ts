export interface FindBoostedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems?: number;
  };
}
