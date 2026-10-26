"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getApiErrorMessage } from "@/lib/api";
import { usePackageMutation } from "@/lib/api/hooks/package";
import { toast } from "@/lib/toast";
import type { PackagePayload } from "../../../../../../types/package";

const PackageForm = dynamic(
  () => import("../_components/package-form").then((module) => module.PackageForm),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Loading package form...</p> },
);

export default function CreatePackagePage() {
  const router = useRouter();
  const { create } = usePackageMutation();

  const handleCreate = async (payload: PackagePayload) => {
    try {
      await create.mutateAsync(payload);
      toast.success("Package created successfully.");
      router.push("/dashboard/admin-dashboard/package");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create package</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter package pricing, modules, and limits.</p>
      </div>
      <PackageForm
      mode="create"
      isPending={create.isPending}
      onSubmit={handleCreate}
      />
    </section>
  );
}
