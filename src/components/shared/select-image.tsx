"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Check, ImagePlus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/shared/modal"
import { Pagination } from "@/components/shared/pagination"
import { useGalleryMutation, useGalleryQuery } from "@/lib/api/hooks/gallery"
import { getImageUrl } from "@/lib/image-url"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"

type SelectImageProps = {
  value?: string
  onChange: (imageUrl: string) => void
}

export default function SelectImage({ value, onChange }: SelectImageProps) {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file])

  const limit = 12
  const { data, isPending, isError, error } = useGalleryQuery({ page, limit })
  const images = data?.data ?? []
  const { uploadImage } = useGalleryMutation()

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  async function handleUpload() {
    if (!file || uploadImage.isPending) return
    try {
      const uploaded = await uploadImage.mutateAsync(file)
      if (!uploaded.imageUrl) throw new Error("The uploaded image URL is missing.")
      onChange(uploaded.imageUrl)
      setFile(null)
      setFileError("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      setOpen(false)
      toast.success("Photo uploaded and selected")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <Modal
      trigger={(
        <Button type="button" variant="outline" className="h-auto w-full flex-col gap-3 py-4">
          {value ? (
            <span className="relative size-24 shrink-0 overflow-hidden rounded-full">
              <Image src={getImageUrl(value) ?? value} alt="Selected employee photo" fill sizes="96px" unoptimized className="rounded-full object-cover" />
            </span>
          ) : (
            <span className="flex size-24 items-center justify-center rounded-full border border-dashed bg-muted/40">
              <ImagePlus className="size-7" aria-hidden="true" />
            </span>
          )}
          <span>{value ? "Change photo" : "Choose employee photo"}</span>
        </Button>
      )}
      title="Choose employee photo"
      description="Select an image from your media gallery."
      open={open}
      onOpenChange={setOpen}
      contentClassName="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <figure className="relative aspect-square overflow-hidden rounded-lg border bg-card">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => {
                const selectedFile = event.currentTarget.files?.[0] ?? null
                const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
                if (selectedFile && !supportedTypes.includes(selectedFile.type)) {
                  setFile(null)
                  setFileError("Choose a JPG, PNG, WEBP, or GIF image.")
                  event.currentTarget.value = ""
                } else if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
                  setFile(null)
                  setFileError("Image must be 5 MB or smaller.")
                  event.currentTarget.value = ""
                } else {
                  setFile(selectedFile)
                  setFileError("")
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadImage.isPending}
              aria-label={file ? "Change image to upload" : "Choose an image to upload"}
              className="absolute inset-0 flex w-full cursor-pointer flex-col items-center justify-center gap-2 bg-white p-3 text-center transition hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:cursor-wait"
            >
              {file ? (
                <img src={previewUrl} alt="Selected upload preview" className="absolute inset-0 size-full object-cover" />
              ) : (
                <>
                  <span className="flex size-12 items-center justify-center rounded-full border bg-white shadow-sm">
                    <ImagePlus className="size-6 text-primary" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium">Upload image</span>
                </>
              )}
              {file && <span className="absolute inset-x-0 top-0 truncate bg-black/60 px-2 py-1 text-xs text-white">{file.name}</span>}
            </button>
            {file && (
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={uploadImage.isPending}
                className="absolute inset-x-2 bottom-2 z-10 shadow"
              >
                <Upload aria-hidden="true" />
                {uploadImage.isPending ? "Uploading..." : "Upload image"}
              </Button>
            )}
          </figure>
          {isPending ? (
            <p className="col-span-1 self-center text-sm text-muted-foreground">Loading images...</p>
          ) : isError ? (
            <p role="alert" className="col-span-1 self-center text-sm text-destructive">Could not load images: {error.message}</p>
          ) : images.length === 0 ? (
            <p className="col-span-1 self-center text-sm text-muted-foreground">No images uploaded yet.</p>
          ) : images.map((image) => {
              const src = getImageUrl(image.imageUrl)
              const selected = Boolean(image.imageUrl && value === image.imageUrl)
              return (
                <button
                  key={image.id}
                  type="button"
                  disabled={!src}
                  onClick={() => {
                    if (!image.imageUrl) return
                    onChange(image.imageUrl)
                    setOpen(false)
                  }}
                  aria-label={`Choose ${image.title || "gallery image"}`}
                  aria-pressed={selected}
                  className={`relative aspect-square overflow-hidden rounded-lg border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${selected ? "ring-2 ring-primary" : ""}`}
                >
                  {src && <Image src={src} alt={image.altText || image.title || "Gallery image"} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />}
                  {selected && <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground"><Check className="size-4" /></span>}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs text-white">{image.title || "Untitled image"}</span>
                </button>
              )
            })}
        </div>
        {fileError && <p className="text-sm text-destructive" role="alert">{fileError}</p>}
        {!isPending && !isError && (data?.meta.total ?? 0) > limit && (
          <Pagination page={data?.meta.page ?? page} total={data?.meta.total ?? 0} limit={data?.meta.limit ?? limit} onPageChange={setPage} />
        )}
      </div>
    </Modal>
  )
}
