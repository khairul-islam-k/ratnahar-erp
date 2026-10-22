"use client";

import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "../permission";
import { queryKeys } from "../query-keys";

export function usePermissionQuery() {
  return useQuery({
    queryKey: queryKeys.permission.list(),
    queryFn: () => permissionApi.list(),
  });
}
