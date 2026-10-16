import type { QueryType } from "../../../types/gallery";

export const queryKeys = {
  gallery: {
    all: ["gallery"] as const,
    list: (query: QueryType) =>
      ["gallery", "list", query] as const,
  },
};
