export type GalleryStatus = "ACTIVE" | "INACTIVE";

export interface GalleryItem {
  id: string;
  tenantId: string;
  title: string;
  imageUrl: string | null;
  altText: string | null;
  status: GalleryStatus;
  createdAt: string;
  updatedAt: string;
}

export type QueryType = {
  page: number;
  limit: number
}
