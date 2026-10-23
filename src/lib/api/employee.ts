import type { CreateEmployeePayload, EmployeeQuery, UserResponse, UserStatus } from "../../../types/employee";
import { api } from "../api";
import { buildQuery, type PaginatedResponse } from "./response";

export const employeeApi = {
  create(payload: CreateEmployeePayload) {
    return api
      .post<UserResponse>("/employee", payload)
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
  },

  list(query?: EmployeeQuery) {
    return api
      .get<PaginatedResponse<UserResponse>>(`/employee${buildQuery(query)}`)
      .then((res) => res.data);
  },
};
