"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreatePackagePayload, PackageQuery, UpdatePackagePayload } from "../../../../types/package";
import { packageApi } from "../package";
import { queryKeys } from "../query-keys";

export function usePackageQuery(query?: PackageQuery) {
  return useQuery({
    queryKey: queryKeys.package.list(query),
    queryFn: () => packageApi.list(query),
  });
}

export function usePackageByIdQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.package.detail(id),
    queryFn: () => packageApi.getById(id),
    enabled: Boolean(id),
  });
}

export function usePackageMutation() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: (payload: CreatePackagePayload) => packageApi.create(payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.package.all }),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdatePackagePayload }) =>
        packageApi.update(id, payload),
      onSuccess: (_data, variables) => Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.package.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.package.detail(variables.id) }),
      ]),
    }),
    delete: useMutation({
      mutationFn: (id: string) => packageApi.delete(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.package.all }),
    }),
  };
}
