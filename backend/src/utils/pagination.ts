/**
 * Standard Pagination Envelope Utilities
 */

export interface PaginationEnvelope<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

/**
 * Parses and sanitizes page and pageSize query parameters
 */
export function parsePaginationParams(
  query: { page?: unknown; pageSize?: unknown; limit?: unknown },
  defaultPageSize = 20,
  maxPageSize = 100
): PaginationParams {
  const rawPage = Number(query.page);
  const page = !isNaN(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const rawSize = Number(query.pageSize || query.limit);
  let pageSize = !isNaN(rawSize) && rawSize >= 1 ? Math.floor(rawSize) : defaultPageSize;
  if (pageSize > maxPageSize) pageSize = maxPageSize;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
}

/**
 * Constructs a standard pagination envelope object
 */
export function createPaginationEnvelope<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginationEnvelope<T> {
  const safePageSize = pageSize > 0 ? pageSize : 1;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const currentPage = Math.max(1, page);

  return {
    data,
    page: currentPage,
    pageSize: safePageSize,
    total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}
