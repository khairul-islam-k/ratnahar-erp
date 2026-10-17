"use client";

import { useState } from "react";
import { Images, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/modal";
import { GalleryImageUpload } from "./_components/gallery-image-upload";
import GalleryImages from "./_components/gallery-images";

export default function GalleryPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Images className="size-4" /> Media library
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Upload and organize images for your store.</p>
        </header>

        <Modal
          trigger={<Button className="cursor-pointer"><Plus /> Add images</Button>}
          title="Upload images"
          description="Add one or more images to your gallery."
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
        >
          <GalleryImageUpload onUploadSuccess={() => setIsUploadDialogOpen(false)} />
        </Modal>
      </div>

      <section>
        <GalleryImages />
      </section>

    </main>
  );
}
