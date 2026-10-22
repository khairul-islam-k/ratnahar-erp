import type { PaginationMeta } from "../src/lib/api/response";
import { QueryType } from "./gallery";

export interface RoleResponse {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleListResponse {
  data: RoleResponse[];
  meta: PaginationMeta;
  message: string;
}

export type RoleQuery = QueryType & {
  search?: string;
}
