"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DynamicTable, type DynamicTableColumn } from "@/components/shared/dynamic-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/toast";
import { usePackageMutation, usePackageQuery } from "@/lib/api/hooks/package";
import type { PackageQuery, PackageResponse, PackageStatus } from "../../../../../types/package";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PackagePage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<PackageStatus | "">("");
    const { delete: deletePackage } = usePackageMutation();
    const limit = 10;
    const query: PackageQuery = {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
    };
    const { data, isPending, isError, error } = usePackageQuery(query);

    const handleDelete = async (item: PackageResponse) => {
        const confirmed = await toast.confirm(`Delete the package "${item.name}"?`, {
            description: "This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            destructive: true,
        });
        if (!confirmed) return;

        try {
            await deletePackage.mutateAsync(item.id);
            toast.success("Package deleted successfully.");
        } catch (deleteError) {
            toast.error(getApiErrorMessage(deleteError));
        }
    };

    const columns: DynamicTableColumn<PackageResponse>[] = [
        { key: "name", header: "Name" },
        { key: "slug", header: "Slug" },
        { key: "pricingType", header: "Pricing" },
        { key: "monthlyPrice", header: "Monthly price" },
        { key: "yearlyPrice", header: "Yearly price" },
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
            key: "id",
            header: "Actions",
            render: (_value, item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label={`Actions for ${item.name}`}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            render={<Link href={`/dashboard/admin-dashboard/package/view/${item.id}`}/>}
                        >
                            <Eye aria-hidden="true" />
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            render={<Link href={`/dashboard/admin-dashboard/package/update/${item.id}`} />}
                        >
                            <Pencil aria-hidden="true" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            variant="destructive"
                            disabled={deletePackage.isPending}
                            onClick={() => void handleDelete(item)}
                        >
                            <Trash2 aria-hidden="true" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

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
                            <Link
                                href="/dashboard/admin-dashboard/package/create"
                                className={buttonVariants({ className: "cursor-pointer" })}
                            >
                                <Plus aria-hidden="true" />
                                Create Package
                            </Link>
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
