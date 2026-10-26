"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTenantPayload, TenantManageQuery, UpdateTenantPayload } from "../../../../types/tenant-manage";
import { tenantManageApi } from "../tenant-manage";
import { queryKeys } from "../query-keys";

export function useTenantManageQuery(query?: TenantManageQuery) {
  return useQuery({
    queryKey: queryKeys.tenantManage.list(query),
    queryFn: () => tenantManageApi.list(query),
  });
}

export function useTenantManageByIdQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.tenantManage.detail(id),
    queryFn: () => tenantManageApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useTenantManageMutation() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: (payload: CreateTenantPayload) => tenantManageApi.create(payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tenantManage.all }),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdateTenantPayload }) =>
        tenantManageApi.update(id, payload),
      onSuccess: (_data, variables) => Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tenantManage.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tenantManage.detail(variables.id) }),
      ]),
    }),
  };
}
