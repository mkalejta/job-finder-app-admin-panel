export interface PageResponse<T> {
  readonly content: T[];
  readonly pageable: {
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly sort: {
      readonly empty: boolean;
      readonly sorted: boolean;
      readonly unsorted: boolean;
    };
    readonly offset: number;
    readonly paged: boolean;
    readonly unpaged: boolean;
  };
  readonly last: boolean;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly first: boolean;
  readonly size: number;
  readonly number: number;
  readonly sort: {
    readonly empty: boolean;
    readonly sorted: boolean;
    readonly unsorted: boolean;
  };
  readonly numberOfElements: number;
  readonly empty: boolean;
};
