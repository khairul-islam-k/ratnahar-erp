import { AuthResponse, LoginPayload, RefreshResponse } from "../../../types/auth";
import { publicApi, refreshApi } from "../api";

export const authApi = {
  login(payload: LoginPayload) {
    return publicApi
      .post<AuthResponse>("/auth/login", payload)
      .then((res) => (res.data));
  },

  refresh() {
    return refreshApi
      .post<RefreshResponse>("/auth/refresh")
      .then((res) => (res.data))
  },
};