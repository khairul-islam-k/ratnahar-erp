"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectImage from "@/components/shared/select-image";
import type { CreateTenantPayload, TenantManageStatus } from "../../../../../../types/tenant-manage";

export type TenantFormValues = CreateTenantPayload & { status: TenantManageStatus };

const tenantListPath = "/dashboard/admin-dashboard/tenant";

type TenantFormProps = {
  mode: "create" | "update";
  defaultValues: TenantFormValues;
  isPending: boolean;
  onSubmit: SubmitHandler<TenantFormValues>;
};

export function TenantForm({ mode, defaultValues, isPending, onSubmit }: TenantFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormValues>({ defaultValues });

  return (
    <form className="space-y-6 rounded-xl border bg-card p-5 sm:p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2 text-center">
        <label className="block text-sm font-medium" id="tenant-photo-label">
          Tenant photo <span className="text-muted-foreground">(optional)</span>
        </label>
        <div className="mx-auto w-full max-w-xs" aria-labelledby="tenant-photo-label">
          <Controller
            name="photo"
            control={control}
            render={({ field }) => <SelectImage value={field.value} onChange={field.onChange} />}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {mode === "update" && (
          <Field label="Status" name="status">
            <select
              id="status"
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              {...register("status", { required: true })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </Field>
        )}
        <Field label="Tenant name" name="name" error={errors.name?.message}>
          <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name", { required: "Tenant name is required." })} />
        </Field>
        <Field label="Business name" name="businessName" error={errors.businessName?.message}>
          <Input id="businessName" aria-invalid={Boolean(errors.businessName)} {...register("businessName", { required: "Business name is required." })} />
        </Field>
        <Field label="Email" name="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email", { required: "Email is required." })} />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} {...register("phone", { required: "Phone is required." })} />
        </Field>
        {mode === "create" ? (
          <Field label="Password" name="password" error={errors.password?.message}>
            <div className="relative">
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                className="pr-10"
                {...register("password", { required: "Password is required." })}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((visible) => !visible)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
              >
                {passwordVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </Field>
        ) : (
          <input type="hidden" {...register("password")} />
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        <Link href={tenantListPath} className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted">
          Cancel
        </Link>
        <Button type="submit"
        className="cursor-pointer"
         disabled={isSubmitting || isPending}>
          {isPending ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create tenant" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
