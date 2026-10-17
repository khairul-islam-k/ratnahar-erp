import type { GalleryItem, QueryType } from "../../../types/gallery";
import { buildQuery, type PaginatedResponse } from "./response";
import { api } from "../api";

export type BulkDeleteGalleryPayload = {
  ids: string[];
};

export const galleryApi = {
  list(query?: QueryType) {
    return api
      .get<PaginatedResponse<GalleryItem>>(`/gallery${buildQuery(query)}`)
      .then((res) => res.data);
  },

  bulkUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    return api
      .post<GalleryItem[]>("/gallery/bulk", formData)
      .then((res) => res.data);
  },

  bulkDelete(payload: BulkDeleteGalleryPayload) {
    return api
      .delete("/gallery/bulk", { data: payload })
      .then((res) => res.data);
  },

  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api
      .post<GalleryItem>("/gallery", formData)
      .then((res) => res.data)
      .catch(err => console.log('err', err))
  },
};
