"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api";
import { useTenantManageByIdQuery, useTenantManageMutation } from "@/lib/api/hooks/tenant-manage";
import { toast } from "@/lib/toast";
import { TenantForm, type TenantFormValues } from "../../_components/tenant-form";

function UpdateTenantContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isPending, isError, error } = useTenantManageByIdQuery(id);
  const { update } = useTenantManageMutation();

  const handleUpdate = async (values: TenantFormValues) => {
    const { password, ...payload } = values;
    try {
      await update.mutateAsync({
        id,
        payload: { ...payload, ...(password ? { password } : {}) },
      });
      toast.success("Tenant updated successfully.");
      router.push("/dashboard/admin-dashboard/tenant");
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError));
    }
  };

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading tenant...</p>;
  }

  if (isError) {
    return <p role="alert" className="text-sm text-destructive">{getApiErrorMessage(error)}</p>;
  }

  const tenant = data.data;
  const defaultValues: TenantFormValues = {
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    password: "",
    businessName: tenant.businessName ?? "",
    photo: tenant.photo ?? "",
    status: tenant.status,
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Update tenant</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update tenant account and business details.</p>
      </div>
      <TenantForm mode="update" defaultValues={defaultValues} isPending={update.isPending} onSubmit={handleUpdate} />
    </section>
  );
}

export default function UpdateTenantPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading tenant...</p>}>
      <UpdateTenantContent />
    </Suspense>
  );
}
