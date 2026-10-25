"use client";

import { useQuery } from "@tanstack/react-query";
import type { PackageQuery } from "../../../../types/package";
import { packageApi } from "../package";
import { queryKeys } from "../query-keys";

export function usePackageQuery(query?: PackageQuery) {
  return useQuery({
    queryKey: queryKeys.package.list(query),
    queryFn: () => packageApi.list(query),
  });
}
