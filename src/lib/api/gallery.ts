import type { GalleryItem, QueryType } from "../../../types/gallery";
import { buildQuery, type PaginatedResponse } from "./response";
import { api } from "../api";

export const galleryApi = {
  list(query?: QueryType) {
    return api
      .get<PaginatedResponse<GalleryItem>>(`/gallery${buildQuery(query)}`)
      .then((res) => res.data);
  },

  bulkUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return api
      .post<GalleryItem[]>("/gallery/bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api
      .post<GalleryItem>("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};
