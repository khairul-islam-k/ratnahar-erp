import type { GalleryItem, QueryType } from "../../../types/gallery";
import { buildQuery, type PaginatedResponse } from "./response";
import { api } from "../api";

export const galleryApi = {
  list(query: QueryType) {
    return api
      .get<PaginatedResponse<GalleryItem>>(`/gallery${buildQuery(query)}`)
      .then((res) => res.data);
  },
};
