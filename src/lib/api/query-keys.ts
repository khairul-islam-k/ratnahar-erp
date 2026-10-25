import type { QueryType } from "../../../types/gallery";
import type { EmployeeQuery } from "../../../types/employee";
import type { RoleQuery } from "../../../types/role";
import type { PackageQuery } from "../../../types/package";

export const queryKeys = {
  gallery: {
    all: ["gallery"] as const,
    list: (query?: QueryType) =>
      ["gallery", "list", query] as const,
  },
  employee: {
    all: ["employee"] as const,
    list: (query?: EmployeeQuery) => ["employee", "list", query] as const,
    detail: (id: string) => ["employee", "detail", id] as const,
  },
  role: {
    all: ["role"] as const,
    list: (query?: RoleQuery) => ["role", "list", query] as const,
    detail: (id: string) => ["role", "detail", id] as const,
    permissions: (id: string) => ["role", "permissions", id] as const,
  },
  permission: {
    all: ["permission"] as const,
    list: () => ["permission", "list"] as const,
  },
  package: {
    all: ["package"] as const,
    list: (query?: PackageQuery) => ["package", "list", query] as const,
  },
};
