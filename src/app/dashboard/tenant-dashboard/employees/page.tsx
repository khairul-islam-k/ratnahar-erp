"use client"

import { useEmployeeMutation, useEmployeeQuery } from "@/lib/api/hooks/employee"
import { DynamicTable, type DynamicTableColumn } from "@/components/shared/dynamic-table"
import type { UserResponse, UserStatus } from "../../../../../types/employee"
import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getImageUrl } from "@/lib/image-url"
import Image from "next/image"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"

export default function EmployeesPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<UserStatus | "">("")
    const { updateStatus } = useEmployeeMutation()
    const limit = 5
    const { data, isPending, isError, error } = useEmployeeQuery({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
    })

    const handleSearchChange = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    const handleStatusChange = (value: string) => {
        setStatus(value as UserStatus | "")
        setPage(1)
    }

    // action status
    const handleStatusAction = async (id: string, nextStatus: UserStatus, currentStatus: UserStatus) => {
        if (nextStatus === currentStatus) return
        try {
            await updateStatus.mutateAsync({ id, status: nextStatus })
            toast.success("Employee status updated successfully")
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        }
    }

    const columns: DynamicTableColumn<UserResponse>[] = [
        {
            key: "photo",
            header: "Photo",
            render: (value, user) => {
                const imageUrl = value ? getImageUrl(String(value)) : null
                return imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={`${user.name}'s photo`}
                        width={36}
                        height={36}
                        unoptimized
                        className="size-9 rounded-full object-cover"
                    />
                ) : <span className="text-muted-foreground">No photo</span>
            },
        },
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
        { key: "type", header: "Type" },
        {
            key: "status",
            header: "Status",
            render: (value, employee) => (
                <select
                    value={employee.status}
                    onChange={(e) => handleStatusAction(employee.id, e.currentTarget.value as UserStatus, employee.status)}
                    disabled={updateStatus.isPending}
                    aria-label={`Status for ${employee.name}`}
                    className="h-8 min-w-32 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                </select>
            ),
        }

    ]

    return (
        <section className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Employees</h1>
                <p className="text-sm text-muted-foreground">
                    View and manage your employees.
                </p>
            </div>

            {isPending ? (
                <p className="text-sm text-muted-foreground">Loading employees...</p>
            ) : isError ? (
                <p className="text-sm text-destructive">
                    Could not load employees: {error.message}
                </p>
            ) : (
                <DynamicTable
                    columns={columns}
                    data={data.data}
                    getRowKey={(employee) => employee.id}
                    emptyMessage="No employees found."
                    toolbar={(
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                                <Input
                                    value={search}
                                    onChange={(event) => handleSearchChange(event.target.value)}
                                    placeholder="Search employees..."
                                    aria-label="Search employees"
                                    className="pl-8"
                                />
                            </div>
                            <select
                                value={status}
                                onChange={(event) => handleStatusChange(event.target.value)}
                                aria-label="Filter employees by status"
                                className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                <option value="">All statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="SUSPENDED">Suspended</option>
                            </select>
                            <div className="sm:ml-auto">
                                <Link href="/dashboard/tenant-dashboard/employees/create">
                                    <Button className="cursor-pointer">
                                        <Plus aria-hidden="true" />
                                        Create employee
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    pagination={{
                        page: data.meta.page,
                        total: data.meta.total,
                        limit: data.meta.limit,
                        onPageChange: setPage,
                    }}
                />
            )}
        </section>
    )
}
