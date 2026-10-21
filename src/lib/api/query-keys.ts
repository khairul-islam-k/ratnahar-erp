import type { QueryType } from "../../../types/gallery";
import type { EmployeeQuery } from "../../../types/employee";

export const queryKeys = {
  gallery: {
    all: ["gallery"] as const,
    list: (query?: QueryType) =>
      ["gallery", "list", query] as const,
  },
  employee: {
    all: ["employee"] as const,
    list: (query?: EmployeeQuery) => ["employee", "list", query] as const,
  },
};
