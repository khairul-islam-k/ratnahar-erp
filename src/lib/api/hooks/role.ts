"use client";

import { useQuery } from "@tanstack/react-query";
import type { RoleQuery } from "../../../../types/role";
import { roleApi } from "../role";
import { queryKeys } from "../query-keys";

export function useRoleQuery(query?: RoleQuery) {
  return useQuery({
    queryKey: queryKeys.role.list(query),
    queryFn: () => roleApi.list(query),
  });
}
