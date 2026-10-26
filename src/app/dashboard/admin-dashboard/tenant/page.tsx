"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { Pencil, Plus, Search } from "lucide-react";
import { DynamicTable, type DynamicTableColumn } from "@/components/shared/dynamic-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getApiErrorMessage } from "@/lib/api";
import { useTenantManageQuery } from "@/lib/api/hooks/tenant-manage";
import type { TenantManageQuery, TenantManageRecord, TenantManageStatus } from "../../../../../types/tenant-manage";

const columns: DynamicTableColumn<TenantManageRecord>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  {
    key: "status",
    header: "Status",
    render: (value) => (
      <Badge variant={value === "ACTIVE" ? "default" : value === "SUSPENDED" ? "destructive" : "secondary"}>
        {String(value)}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    render: (value) => {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
    },
  },
  {
    key: "id",
    header: "Actions",
    render: (_value, tenant) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={`/dashboard/admin-dashboard/tenant/update/${tenant.id}`}
                aria-label={`Update ${tenant.name}`}
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <Pencil className="size-4" aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Update tenant</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];

export default function TenantsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 1000);
  const [status, setStatus] = useState<TenantManageStatus | "">("");
  const limit = 10;
  const query: TenantManageQuery = {
    page,
    limit,
    search: searchValue || undefined,
    status: status || undefined,
  };
  const { data, isPending, isError, error } = useTenantManageQuery(query);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <p className="text-sm text-muted-foreground">View and search tenant accounts.</p>
      </div>

      {isPending ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading tenants...</p>
      ) : isError ? (
        <p role="alert" className="py-10 text-center text-sm text-destructive">
          {getApiErrorMessage(error)}
        </p>
      ) : (
        <DynamicTable
          columns={columns}
          data={data.data}
          toolbar={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                  <Search aria-hidden="true" className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Search tenants"
                    className="pl-9"
                    placeholder="Search tenants..."
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <select
                  aria-label="Filter tenants by status"
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as TenantManageStatus | "");
                    setPage(1);
                  }}
                >
                  <option value="">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <Link
                href="/dashboard/admin-dashboard/tenant/create"
                className={buttonVariants({ className: "cursor-pointer" })}
              >
                <Plus aria-hidden="true" />
                Create Tenant
              </Link>
            </div>
          }
          getRowKey={(tenant) => tenant.id}
          emptyMessage="No tenants found."
          pagination={{
            page: data.meta.page,
            total: data.meta.total,
            limit: data.meta.limit,
            onPageChange: setPage,
          }}
        />
      )}
    </section>
  );
}
