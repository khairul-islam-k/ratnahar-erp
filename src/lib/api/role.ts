import type { AssignRolePermissionPayload, CreateRolePayload, RoleListResponse, RoleQuery, RoleResponse, UpdateRolePayload } from "../../../types/role";
import { api } from "../api";
import { ApiResponse, buildQuery } from "./response";

export const roleApi = {
  create(payload: CreateRolePayload) {
    return api
      .post<RoleResponse>("/roles", payload)
      .then((res) => res.data);
  },

  update(id: string, payload: UpdateRolePayload) {
    return api
      .patch<RoleResponse>(`/roles/${id}`, payload)
      .then((res) => res.data);
  },

  list(query?: RoleQuery) {
    return api
      .get<RoleListResponse>(`/roles${buildQuery(query)}`)
      .then((res) => res.data);
  },

  getById(id: string) {
    return api
      .get<ApiResponse<RoleResponse>>(`/roles/${id}`)
      .then((res) => res.data);
  },

  delete(roleId: string) {
    return api
      .delete(`/roles/${roleId}`)
      .then((res) => res.data);
  },

  assignPermissions(payload: AssignRolePermissionPayload[]) {
    return api
      .post("/roles/permissions", payload)
      .then((res) => res.data);
  },
};
