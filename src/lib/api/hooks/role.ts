"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AssignRolePermissionPayload, CreateRolePayload, RoleQuery, UpdateRolePayload } from "../../../../types/role";
import { roleApi } from "../role";
import { queryKeys } from "../query-keys";

export function useRoleQuery(query?: RoleQuery) {
  return useQuery({
    queryKey: queryKeys.role.list(query),
    queryFn: () => roleApi.list(query),
  });
}

export function useRoleByIdQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.role.detail(id),
    queryFn: () => roleApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useRoleMutation() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.role.all })

  return {
    create: useMutation({
      mutationFn: (payload: CreateRolePayload) => roleApi.create(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
        roleApi.update(id, payload),
      onSuccess: invalidate,
    }),
    delete: useMutation({
      mutationFn: (roleId: string) => roleApi.delete(roleId),
      onSuccess: invalidate,
    }),
    assignPermissions: useMutation({
      mutationFn: (payload: AssignRolePermissionPayload[]) => roleApi.assignPermissions(payload),
      onSuccess: invalidate,
    }),
  };
}
