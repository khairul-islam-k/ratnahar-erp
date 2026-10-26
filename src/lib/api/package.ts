import type {
  CreatePackagePayload,
  PackageQuery,
  PackageResponse,
  UpdatePackagePayload,
} from "../../../types/package";
import { api } from "../api";
import { buildQuery, type ApiResponse, type PaginatedResponse } from "./response";

export const packageApi = {
  list(query?: PackageQuery) {
    return api
      .get<PaginatedResponse<PackageResponse>>(`/packages${buildQuery(query)}`)
      .then((res) => res.data);
  },

  getById(id: string) {
    return api
      .get<ApiResponse<PackageResponse>>(`/packages/${id}`)
      .then((res) => res.data);
  },

  create(payload: CreatePackagePayload) {
    return api
      .post<ApiResponse<PackageResponse>>("/packages", payload)
      .then((res) => res.data);
  },

  update(id: string, payload: UpdatePackagePayload) {
    return api
      .patch<ApiResponse<PackageResponse>>(`/packages/${id}`, payload)
      .then((res) => res.data);
  },

  delete(id: string) {
    return api.delete(`/packages/${id}`).then((res) => res.data);
  },
};
