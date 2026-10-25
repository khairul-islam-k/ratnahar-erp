"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { DynamicTable, type DynamicTableColumn } from "@/components/shared/dynamic-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api";
import { usePackageQuery } from "@/lib/api/hooks/package";
import type { PackageQuery, PackageResponse, PackageStatus } from "../../../../../types/package";

const columns: DynamicTableColumn<PackageResponse>[] = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    { key: "pricingType", header: "Pricing" },
    {
        key: "monthlyPrice",
        header: "Monthly price",
        render: (value) => String(value),
    },
    {
        key: "yearlyPrice",
        header: "Yearly price",
        render: (value) => String(value),
    },
    {
        key: "status",
        header: "Status",
        render: (value) => (
            <Badge variant={value === "active" ? "default" : "secondary"}>
                {String(value)}
            </Badge>
        ),
    },
    {
        key: "modules",
        header: "Modules",
        render: (value) => {
            const modules = value as PackageResponse["modules"];
            const enabled = modules.filter((module) => module.isEnabled).map((module) => module.moduleKey);
            return enabled.length ? enabled.join(", ") : "-";
        },
    },
    {
        key: "limits",
        header: "Limits",
        render: (value) => {
            const limits = value as PackageResponse["limits"];
            return limits.length
                ? limits.map((limit) => `${limit.limitKey}: ${limit.limitValue}`).join(", ")
                : "-";
        },
    },
    {
        key: "description",
        header: "Description",
        render: (value) => String(value ?? "-") || "-",
    },
];

export default function PackagePage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<PackageStatus | "">("");
    const limit = 10;
    const query: PackageQuery = {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
    };
    const { data, isPending, isError, error } = usePackageQuery(query);

    return (
        <section className="space-y-4">
            <div>
                <div>
                    <h1 className="text-2xl font-semibold">Packages</h1>
                    <p className="text-sm text-muted-foreground">Browse and search available packages.</p>
                </div>
            </div>

            {isPending ? (
                <p className="py-10 text-center text-sm text-muted-foreground">Loading packages...</p>
            ) : isError ? (
                <p role="alert" className="py-10 text-center text-sm text-destructive">
                    {getApiErrorMessage(error)}
                </p>
            ) : (
                <DynamicTable
                    columns={columns}
                    data={data?.data ?? []}
                    toolbar={
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative w-full sm:max-w-sm">
                                    <Search aria-hidden="true" className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        aria-label="Search packages"
                                        className="pl-9"
                                        placeholder="Search packages..."
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                                <select
                                    aria-label="Filter packages by status"
                                    className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
                                    value={status}
                                    onChange={(event) => {
                                        setStatus(event.target.value as PackageStatus | "");
                                        setPage(1);
                                    }}
                                >
                                    <option value="">All statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <Button
                            className='cursor-pointer'
                            render={<Link href="/dashboard/admin-dashboard/package/create" />}>
                                <Plus aria-hidden="true" />
                                Create Package
                            </Button>
                        </div>
                    }
                    getRowKey={(item) => item.id}
                    emptyMessage="No packages found."
                    pagination={data ? {
                        page: data.meta.page,
                        total: data.meta.total,
                        limit: data.meta.limit,
                        onPageChange: setPage,
                    } : undefined}
                />
            )}
        </section>
    );
}
