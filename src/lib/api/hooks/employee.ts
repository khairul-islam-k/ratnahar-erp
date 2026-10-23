"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeePayload, EmployeeQuery, UpdateEmployeePayload, UserStatus } from "../../../../types/employee";
import { employeeApi } from "../employee";
import { queryKeys } from "../query-keys";

export function useEmployeeQuery(query?: EmployeeQuery) {
  return useQuery({
    queryKey: queryKeys.employee.list(query),
    queryFn: () => employeeApi.list(query),
  });
}

export function useEmployeeByIdQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.employee.detail(id),
    queryFn: () => employeeApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useEmployeeMutation() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.employee.all });

  return {
    create: useMutation({
      mutationFn: (payload: CreateEmployeePayload) => employeeApi.create(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
        employeeApi.update(id, payload),
      onSuccess: invalidate,
    }),
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
        employeeApi.updateStatus(id, status),
      onSuccess: invalidate,
    }),
    delete: useMutation({
      mutationFn: (id: string) => employeeApi.delete(id),
      onSuccess: invalidate,
    }),
  };
}
