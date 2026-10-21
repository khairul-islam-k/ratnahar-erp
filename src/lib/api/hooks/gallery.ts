"use client";

import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryApi, type BulkDeleteGalleryPayload } from "../gallery";
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
     uploadImage: useMutation({
      mutationFn: (file: File) => galleryApi.upload(file),
      onSuccess: invalidate,
    }),
     bulkDelete: useMutation({
      mutationFn: (payload: BulkDeleteGalleryPayload) => galleryApi.bulkDelete(payload),
      onSuccess: invalidate,
    }),

  };
}
