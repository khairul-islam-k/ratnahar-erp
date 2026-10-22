import { api } from "../api";
import type { ApiResponse } from "./response";

export type Permission = {
  id: string;
  featureKey: string;
  actionKey: string;
  description: string;
};

export const permissionApi = {
  list() {
    return api
      .get<ApiResponse<Permission[]>>("/permission")
      .then((res) => res.data);
  },
};
