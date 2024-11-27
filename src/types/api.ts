// /types/api.ts
/** Base API response structure */
export interface ApiResponse<T> {
  data: T;
  error: null | {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Pagination metadata */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

/** API error codes */
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMITED = 'RATE_LIMITED'
}