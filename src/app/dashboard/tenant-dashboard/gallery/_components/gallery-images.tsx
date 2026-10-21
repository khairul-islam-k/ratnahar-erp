import { useState } from "react";
import { useGalleryMutation, useGalleryQuery } from "@/lib/api/hooks/gallery";
import { getImageUrl } from "@/lib/image-url";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Check, Copy, Trash2 } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";

const GalleryImages = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { bulkDelete } = useGalleryMutation();

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 12;

  const { data, isPending, isError, error } = useGalleryQuery({
     limit,
     page: currentPage });

  const total = data?.meta.total ?? 0;

  const images = data?.data ?? [];
  const allSelected = images.length > 0 && images.every((image) => selectedIds.includes(image.id));

  function toggleSelection(id: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }

  function toggleAllSelection(checked: boolean) {
    setSelectedIds(checked ? images.map((image) => image.id) : []);
  }

  async function copyImageLink(url: string | null) {
    if (!url) {
      toast.error("Image link is unavailable");
      return;
    }

    const absoluteUrl = new URL(url, window.location.origin).href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(absoluteUrl);
      } else if (!copyWithFallback(absoluteUrl)) {
        throw new Error("Clipboard is unavailable");
      }
      toast.success("Image link copied");
    } catch {
      if (copyWithFallback(absoluteUrl)) {
        toast.success("Image link copied");
      } else {
        toast.error("Could not copy image link");
      }
    }
  }

  function copyWithFallback(value: string) {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(input);
    return copied;
  }

  async function deleteSelectedImages() {
    if (!selectedIds.length || bulkDelete.isPending) return;

    try {
      const count = selectedIds.length;
      await bulkDelete.mutateAsync({
        ids: selectedIds
      });
      setSelectedIds([]);
      toast.success(`${count} image${count === 1 ? "" : "s"} deleted successfully`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      console.log(getApiErrorMessage(error))
    }
  }

  if (isPending) return <p className="text-sm text-muted-foreground">Loading images...</p>;

  if (isError) return <p className="text-sm text-destructive" role="alert">{error.message}</p>;

  if (!images.length) return <p className="text-sm text-muted-foreground">No images uploaded yet.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(event) => toggleAllSelection(event.currentTarget.checked)}
            aria-label="Select all images"
            className="size-4 accent-primary cursor-pointer"
          />
          <span>{selectedIds.length ? `${selectedIds.length} selected` : "Select all"}</span>
        </label>
        <Button
          className="cursor-pointer"
          type="button"
          variant="destructive"
          size="sm"
          disabled={!selectedIds.length || bulkDelete.isPending}
          onClick={deleteSelectedImages}
          aria-label="Delete selected images"
        >
          <Trash2 />
          {bulkDelete.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {images.map((image, index) => {
        const src = getImageUrl(image.imageUrl);
        const isSelected = selectedIds.includes(image.id);

        return (
          <figure key={image.id} className={`overflow-hidden rounded-lg border bg-card ${isSelected ? "ring-2 ring-primary" : ""}`}>
            <button
              type="button"
              aria-label={`${isSelected ? "Deselect" : "Select"} ${image.title || "gallery image"}`}
              aria-pressed={isSelected}
              onClick={() => toggleSelection(image.id)}
              className="relative block aspect-square w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              {src ? (
                <Image
                  src={src}
                  alt={image.altText || image.title || "Gallery image"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <span className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                  Image unavailable
                </span>
              )}
              {isSelected && (
                <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  <Check className="size-4" aria-hidden="true" />
                </span>
              )}
            </button>
            <figcaption className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-sm">{image.title || "Untitled image"}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => copyImageLink(src)}
                disabled={!src}
                aria-label={`Copy link for ${image.title || "gallery image"}`}
                title="Copy image link"
                className="cursor-pointer"
              >
                <Copy aria-hidden="true" />
              </Button>
            </figcaption>
          </figure>
        );
      })}
      </div>

      <Pagination
        page={currentPage}
        total={total}
        limit={limit}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default GalleryImages
