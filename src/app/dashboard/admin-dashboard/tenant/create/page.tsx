"use client";

import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api";
import { useTenantManageMutation } from "@/lib/api/hooks/tenant-manage";
import { toast } from "@/lib/toast";
import { TenantForm, type TenantFormValues } from "../_components/tenant-form";

const emptyValues: TenantFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  businessName: "",
  photo: "",
  status: "ACTIVE",
};

export default function CreateTenantPage() {
  const router = useRouter();
  const { create } = useTenantManageMutation();

  const handleCreate = async (values: TenantFormValues) => {
    const { status: _status, ...payload } = values;
    try {
      await create.mutateAsync(payload);
      toast.success("Tenant created successfully.");
      router.push("/dashboard/admin-dashboard/tenant");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create tenant</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the tenant account and business details.</p>
      </div>
      <TenantForm mode="create" defaultValues={emptyValues} isPending={create.isPending} onSubmit={handleCreate} />
    </section>
  );
}
