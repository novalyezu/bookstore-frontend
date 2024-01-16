export interface IPagination {
  currentPage: number,
  nextPage: number | null,
  prevPage: number | null,
  totalData: number,
  totalPage: number,
}

export interface IQueryParams {
  page: number;
  limit: number;
  orderBy: string;
}

export interface IBaseSuccessResponse<T> {
  status: string;
  data: T,
  meta?: IPagination
  message?: string
}

export interface IBaseErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  requestId: string;
}
