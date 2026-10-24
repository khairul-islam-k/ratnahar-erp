import { AuthResponse, LoginPayload, Permissions, RefreshResponse, RegisterPayload } from "../../../types/auth";
import { api, publicApi, refreshApi } from "../api";
import { ApiResponse } from "./response";

export const authApi = {
  login(payload: LoginPayload) {
    return publicApi
      .post<AuthResponse>("/auth/login", payload)
      .then((res) => (res.data));
  },

  permission() {
    return api
      .get<ApiResponse<Permissions[]>>("/permission/my-permissions")
      .then((res) => res.data);
  },

  register(payload: RegisterPayload) {
    return publicApi
      .post<AuthResponse>("/auth/register", payload)
      .then((res) => res.data);
  },

  refresh() {
    return refreshApi
      .post<RefreshResponse>("/auth/refresh")
      .then((res) => (res.data))
  },

  logout() {
    return api
      .post("/auth/logout")
      .then((res) => res.data);
  }
};
