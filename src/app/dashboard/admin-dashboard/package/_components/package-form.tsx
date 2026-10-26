"use client";

import Link from "next/link";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PackagePayload } from "../../../../../../types/package";

const packageListPath = "/dashboard/admin-dashboard/package";
const packageLimitOptions = [
  { value: "max_products", label: "Maximum products" },
  { value: "max_employees", label: "Maximum employees" },
  { value: "max_users", label: "Maximum users" },
  { value: "max_branches", label: "Maximum branches" },
  { value: "max_storage", label: "Maximum storage" },
];

const emptyValues: PackagePayload = {
  name: "",
  slug: "",
  pricingType: "fixed",
  monthlyPrice: "",
  yearlyPrice: "",
  description: "",
  status: "active",
  modules: [{ moduleKey: "", isEnabled: true }],
  limits: [{ limitKey: "", limitValue: 0 }],
};

type PackageFormProps = {
  mode: "create" | "update";
  initialValues?: PackagePayload;
  isPending: boolean;
  onSubmit: SubmitHandler<PackagePayload>;
};

export function PackageForm({ mode, initialValues, isPending, onSubmit }: PackageFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PackagePayload>({
    defaultValues: initialValues ?? emptyValues,
  });
  const modules = useFieldArray({ control, name: "modules" });
  const limits = useFieldArray({ control, name: "limits" });
  
  const limitOptions = [
    ...packageLimitOptions,
    ...(initialValues?.limits ?? [])
      .filter((limit) => !packageLimitOptions.some((option) => option.value === limit.limitKey))
      .map((limit) => ({ value: limit.limitKey, label: limit.limitKey })),
  ];

  return (
    <form
      className="space-y-6 rounded-xl border bg-card p-5 sm:p-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="package-name" className="mb-2 block text-sm font-medium">Package name</label>
          <Input
            id="package-name"
            aria-invalid={Boolean(errors.name)}
            {...register("name", { required: "Package name is required." })}
          />
          {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="package-slug" className="mb-2 block text-sm font-medium">Slug</label>
          <Input
            id="package-slug"
            aria-invalid={Boolean(errors.slug)}
            {...register("slug", { required: "Slug is required." })}
          />
          {errors.slug && <p className="mt-1.5 text-sm text-destructive">{errors.slug.message}</p>}
        </div>

        <div>
          <label htmlFor="pricing-type" className="mb-2 block text-sm font-medium">Pricing type</label>
          <select id="pricing-type" className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" {...register("pricingType", { required: true })}>
            <option value="fixed">Fixed</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label htmlFor="package-status" className="mb-2 block text-sm font-medium">Status</label>
          <select id="package-status" className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" {...register("status", { required: true })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="monthly-price" className="mb-2 block text-sm font-medium">Monthly price</label>
          <Input id="monthly-price" type="number" min="0" step="0.01" aria-invalid={Boolean(errors.monthlyPrice)} {...register("monthlyPrice", { required: "Monthly price is required." })} />
          {errors.monthlyPrice && <p className="mt-1.5 text-sm text-destructive">{errors.monthlyPrice.message}</p>}
        </div>

        <div>
          <label htmlFor="yearly-price" className="mb-2 block text-sm font-medium">Yearly price</label>
          <Input id="yearly-price" type="number" min="0" step="0.01" aria-invalid={Boolean(errors.yearlyPrice)} {...register("yearlyPrice", { required: "Yearly price is required." })} />
          {errors.yearlyPrice && <p className="mt-1.5 text-sm text-destructive">{errors.yearlyPrice.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="package-description" className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            id="package-description"
            className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("description")}
          />
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Modules</h2>
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => modules.append({ moduleKey: "", isEnabled: true })}>Add module</Button>
        </div>
        {modules.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <div>
              <label htmlFor={`module-${index}`} className="mb-2 block text-sm font-medium">Module key</label>
              <Input id={`module-${index}`} placeholder="inventory" {...register(`modules.${index}.moduleKey`, { required: "Module key is required." })} />
              {errors.modules?.[index]?.moduleKey && <p className="mt-1.5 text-sm text-destructive">{errors.modules[index]?.moduleKey?.message}</p>}
            </div>
            <label className="flex h-9 cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 accent-primary" {...register(`modules.${index}.isEnabled`)} />
              Enabled
            </label>
            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => modules.remove(index)} disabled={modules.fields.length === 1}>Remove</Button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Limits</h2>
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => limits.append({ limitKey: "", limitValue: 0 })}>Add limit</Button>
        </div>
        {limits.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            
            <div>
              <label htmlFor={`limit-key-${index}`} className="mb-2 block text-sm font-medium">Limit key</label>
              <select
                id={`limit-key-${index}`}
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                {...register(`limits.${index}.limitKey`, { required: "Select a limit key." })}
              >
                <option value="">Select a limit</option>
                {limitOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.limits?.[index]?.limitKey && <p className="mt-1.5 text-sm text-destructive">{errors.limits[index]?.limitKey?.message}</p>}
            </div>

            <div>
              <label htmlFor={`limit-value-${index}`} className="mb-2 block text-sm font-medium">Limit value</label>
              <Input id={`limit-value-${index}`} type="number" min="0" step="1" {...register(`limits.${index}.limitValue`, { valueAsNumber: true, min: { value: 0, message: "Limit must be zero or greater." } })} />
              {errors.limits?.[index]?.limitValue && <p className="mt-1.5 text-sm text-destructive">{errors.limits[index]?.limitValue?.message}</p>}
            </div>

            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => limits.remove(index)} disabled={limits.fields.length === 1}>Remove</Button>
          </div>
        ))}
      </section>

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        <Link href={packageListPath} className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted">
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting || isPending}>
          {isPending ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create package" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

// use it in update

export function packageResponseToPayload(value: {
  name: string;
  slug: string;
  pricingType: PackagePayload["pricingType"];
  monthlyPrice: string;
  yearlyPrice: string;
  description: string | null;
  status: PackagePayload["status"];
  modules: { moduleKey: string; isEnabled: boolean }[];
  limits: { limitKey: string; limitValue: number }[];
}): PackagePayload {
  return {
    name: value.name,
    slug: value.slug,
    pricingType: value.pricingType,
    monthlyPrice: value.monthlyPrice,
    yearlyPrice: value.yearlyPrice,
    description: value.description ?? "",
    status: value.status,
    modules: value.modules.map(({ moduleKey, isEnabled }) => ({ moduleKey, isEnabled })),
    limits: value.limits.map(({ limitKey, limitValue }) => ({ limitKey, limitValue })),
  };
}
