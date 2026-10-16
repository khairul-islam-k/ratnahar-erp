"use client";

import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "../gallery";
import { queryKeys } from "../query-keys";
import type { QueryType } from "../../../../types/gallery";

export function useGalleryQuery(query?: QueryType) {
  return useQuery({
    queryKey: queryKeys.gallery.list(query),
    queryFn: () => galleryApi.list(query),
  });
}

export function useGalleryMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });

  return {

     multipleImage: useMutation({
      mutationFn: (files: File[]) => galleryApi.bulkUpload(files),
      onSuccess: invalidate,
    }),


  };
}
