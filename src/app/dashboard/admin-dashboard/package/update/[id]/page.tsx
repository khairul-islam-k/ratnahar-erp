"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { packageResponseToPayload } from "../../_components/package-form";
import { getApiErrorMessage } from "@/lib/api";
import { usePackageByIdQuery, usePackageMutation } from "@/lib/api/hooks/package";
import { toast } from "@/lib/toast";
import type { PackagePayload } from "../../../../../../../types/package";

const PackageForm = dynamic(
  () => import("../../_components/package-form").then((module) => module.PackageForm),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Loading package form...</p> },
);

function UpdatePackageContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isPending, isError, error } = usePackageByIdQuery(id);
  const { update } = usePackageMutation();

  const handleUpdate = async (payload: PackagePayload) => {
    try {
      await update.mutateAsync({ id, payload });
      toast.success("Package updated successfully.");
      router.push("/dashboard/admin-dashboard/package");
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError));
    }
  };

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading package...</p>;
  }

  if (isError) {
    return <p role="alert" className="text-sm text-destructive">{getApiErrorMessage(error)}</p>;
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Update package</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edit package pricing, modules, and limits.</p>
      </div>
      <PackageForm
        mode="update"
        initialValues={packageResponseToPayload(data.data)}
        isPending={update.isPending}
        onSubmit={handleUpdate}
      />
    </section>
  );
}

export default function UpdatePackagePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading package...</p>}>
      <UpdatePackageContent />
    </Suspense>
  );
}
