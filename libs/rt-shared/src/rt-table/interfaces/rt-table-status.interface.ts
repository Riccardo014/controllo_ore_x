export interface RtTableStatus {
  fulltextSearch?: string;

  where?: any[] | any;
  order?: any;
  pagination: {
    totalItems?: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
