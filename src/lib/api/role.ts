import type { RoleListResponse, RoleQuery } from "../../../types/role";
import { api } from "../api";
import { buildQuery } from "./response";

export const roleApi = {
  list(query?: RoleQuery) {
    return api
      .get<RoleListResponse>(`/roles${buildQuery(query)}`)
      .then((res) => res.data);
  },
};
