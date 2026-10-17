"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { CheckCircle2, ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGalleryMutation } from "@/lib/api/hooks/gallery";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/toast";

export function GalleryImageUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  const { multipleImage } = useGalleryMutation();

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function addFiles(incoming: FileList | File[]) {
    const images = Array.from(incoming).filter((file) => file.type.startsWith("image/"));
    if (!images.length) return;

    setFiles((current) => {
      const existing = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      return [
        ...current,
        ...images.filter((file) => !existing.has(`${file.name}-${file.size}-${file.lastModified}`)),
      ];
    });
    multipleImage.reset();
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!files.length || multipleImage.isPending) return;

    try {
      await multipleImage.mutateAsync(files);
      toast.success("Images uploaded successfully");
      setFiles([]);
      onUploadSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    multipleImage.reset();
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Add images</CardTitle>
        <CardDescription>Select multiple images or drag them into the upload area.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleUpload}>
          <input
            ref={fileInputRef}
            className="sr-only"
            id="gallery-images"
            type="file"
            accept="image/*"
            multiple
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              addFiles(event.currentTarget.files ?? []);
              event.currentTarget.value = "";
            }}
          />
          <div
            role="button"
            tabIndex={0}
            aria-label="Choose or drop images to upload"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
              }`}
          >
            <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
              <ImagePlus className="size-6 text-primary" />
            </span>
            <span className="font-medium">Drop your images here</span>
            <span className="mt-1 text-sm text-muted-foreground">or click to browse your files</span>
            <span className="mt-3 text-xs text-muted-foreground">Image files · Multiple files supported</span>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Selected images <span className="text-muted-foreground">({files.length})</span>
                </p>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFiles([])}>
                  Clear all
                </Button>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="group relative overflow-hidden rounded-lg border bg-muted/20"
                  >
                    <img src={previews[index]} alt={file.name} className="aspect-square w-full object-cover" />
                    <div className="flex items-center justify-between gap-2 p-2">
                      <span className="truncate text-xs text-muted-foreground" title={file.name}>{file.name}</span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => removeFile(index)}
                      >
                        <X />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5 text-sm" aria-live="polite">
              {multipleImage.isError && (
                <p className="text-destructive" role="alert">{multipleImage.error.message}</p>
              )}
              {multipleImage.isSuccess && (
                <p className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="size-4" /> Images uploaded successfully.
                </p>
              )}
              {!multipleImage.isError && !multipleImage.isSuccess && (
                <p className="text-muted-foreground">
                  {files.length
                    ? `${files.length} image${files.length === 1 ? "" : "s"} ready to upload`
                    : "Choose one or more images to get started"}
                </p>
              )}
            </div>
            <Button type="submit" disabled={!files.length || multipleImage.isPending}>
              <Upload /> {multipleImage.isPending ? "Uploading images..." : `Upload ${files.length || "images"}`}
            </Button>
          </div>
        </form>
      </CardContent>

    </Card>
  );
}
