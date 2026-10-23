"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeePayload, EmployeeQuery, UserStatus } from "../../../../types/employee";
import { employeeApi } from "../employee";
import { queryKeys } from "../query-keys";

export function useEmployeeQuery(query?: EmployeeQuery) {
  return useQuery({
    queryKey: queryKeys.employee.list(query),
    queryFn: () => employeeApi.list(query),
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
