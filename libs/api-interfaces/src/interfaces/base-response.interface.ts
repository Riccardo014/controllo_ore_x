export interface ApiResponse<TReadDto> {
  data: TReadDto;
}

export interface ApiPaginatedResponse<TReadDto> {
  data: TReadDto[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems?: number;
  };
}
