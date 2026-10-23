import type { CreateEmployeePayload, EmployeeQuery, UpdateEmployeePayload, UserResponse, UserStatus } from "../../../types/employee";
import { api } from "../api";
import { buildQuery, type ApiResponse, type PaginatedResponse } from "./response";

export const employeeApi = {
  list(query?: EmployeeQuery) {
    return api
      .get<PaginatedResponse<UserResponse>>(`/employee${buildQuery(query)}`)
      .then((res) => res.data);
  },

  getById(id: string) {
    return api
      .get<ApiResponse<UserResponse>>(`/employee/${id}`)
      .then((res) => res.data);
  },
  
  create(payload: CreateEmployeePayload) {
    return api
      .post<UserResponse>("/employee", payload)
      .then((res) => res.data);
  },

  update(id: string, payload: UpdateEmployeePayload) {
    return api
      .patch<UserResponse>(`/employee/${id}`, payload)
      .then((res) => res.data);
  },

  updateStatus(id: string, status: UserStatus) {
    return api
      .patch<UserResponse>(`/employee/${id}/status`, { status })
      .then((res) => res.data);
  },

  delete(id: string) {
    return api
      .delete(`/employee/${id}`)
      .then((res) => res.data);
  }
};
