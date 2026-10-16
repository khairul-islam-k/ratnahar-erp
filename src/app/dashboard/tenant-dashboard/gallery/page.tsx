"use client";

import { useGalleryQuery } from "@/lib/api/hooks/gallery";

export default function GalleryPage() {
  const { data, isPending, isError, error } = useGalleryQuery({
    limit: 5,
    page: 1
  });

  if (isPending) return <p>Loading gallery...</p>;
  if (isError) return <p role="alert">{error.message}</p>;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
      <ul className="space-y-2">
        {data.data.map((item) => (
          <li key={item.id}>
            {item.title} <span className="text-muted-foreground">({item.status})</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} items)
      </p>
    </section>
  );
}
