import type {
  CreateTenantPayload,
  TenantManageDetail,
  TenantManageQuery,
  TenantManageRecord,
  UpdateTenantPayload,
} from "../../../types/tenant-manage";
import { api } from "../api";
import { buildQuery, type ApiResponse, type PaginatedResponse } from "./response";

export const tenantManageApi = {
  list(query?: TenantManageQuery) {
    return api
      .get<PaginatedResponse<TenantManageRecord>>(`/tenant${buildQuery(query)}`)
      .then((res) => res.data);
  },

  getById(id: string) {
    return api
      .get<ApiResponse<TenantManageDetail>>(`/tenant/${id}`)
      .then((res) => res.data);
  },

  create(payload: CreateTenantPayload) {
    return api
      .post<ApiResponse<TenantManageDetail>>("/tenant", payload)
      .then((res) => res.data);
  },

  update(id: string, payload: UpdateTenantPayload) {
    return api
      .patch<ApiResponse<TenantManageDetail>>(`/tenant/${id}`, payload)
      .then((res) => res.data);
  },
};
