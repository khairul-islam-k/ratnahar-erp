"use client";

import { useQuery } from "@tanstack/react-query";
import { galleryApi } from "../gallery";
import { queryKeys } from "../query-keys";
import type { QueryType } from "../../../../types/gallery";

export function useGalleryQuery(query: QueryType) {
  return useQuery({
    queryKey: queryKeys.gallery.list(query),
    queryFn: () => galleryApi.list(query),
  });
}
