export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ApiResult<T> {
  succeded: boolean;
  data: T;
  errors?: string[];
}
