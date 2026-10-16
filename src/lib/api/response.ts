export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

type QueryValue = string | number | boolean | null | undefined;

export function buildQuery(query: Record<string, QueryValue>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
