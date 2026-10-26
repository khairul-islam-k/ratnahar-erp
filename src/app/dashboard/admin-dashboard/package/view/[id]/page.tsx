"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api";
import { usePackageByIdQuery } from "@/lib/api/hooks/package";

function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, error } = usePackageByIdQuery(id);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading package...</p>;
  }

  if (isError) {
    return <p role="alert" className="text-sm text-destructive">{getApiErrorMessage(error)}</p>;
  }

  const item = data.data;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="text-sm text-muted-foreground">Package details</p>
        </div>
        <Link href="/dashboard/admin-dashboard/package" className={buttonVariants({ variant: "outline", className: "cursor-pointer" })}>
          Back to Packages
        </Link>
      </div>

      <dl className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div><dt className="text-sm text-muted-foreground">Slug</dt><dd className="font-medium">{item.slug}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Status</dt><dd><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge></dd></div>
        <div><dt className="text-sm text-muted-foreground">Pricing type</dt><dd className="font-medium">{item.pricingType}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Monthly price</dt><dd className="font-medium">{item.monthlyPrice}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Yearly price</dt><dd className="font-medium">{item.yearlyPrice}</dd></div>
        <div className="sm:col-span-2 lg:col-span-3"><dt className="text-sm text-muted-foreground">Description</dt><dd className="font-medium">{item.description || "-"}</dd></div>
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Modules</h2>
          {item.modules.length ? (
            <ul className="divide-y rounded-lg border">
              {item.modules.map((module) => (
                <li key={module.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span>{module.moduleKey}</span>
                  <Badge variant={module.isEnabled ? "default" : "secondary"}>{module.isEnabled ? "Enabled" : "Disabled"}</Badge>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No modules configured.</p>}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Limits</h2>
          {item.limits.length ? (
            <ul className="divide-y rounded-lg border">
              {item.limits.map((limit) => (
                <li key={limit.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span>{limit.limitKey}</span>
                  <span className="font-medium">{limit.limitValue}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No limits configured.</p>}
        </section>
      </div>
    </section>
  );
}

export default function ViewPackagePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading package...</p>}>
      <PackageDetails />
    </Suspense>
  );
}
