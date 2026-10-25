import type { PackageQuery, PackageResponse } from "../../../types/package";
import { api } from "../api";
import { buildQuery, type PaginatedResponse } from "./response";

export const packageApi = {
  list(query?: PackageQuery) {
    return api
      .get<PaginatedResponse<PackageResponse>>(`/packages${buildQuery(query)}`)
      .then((res) => res.data);
  },
};
