"use client"

import { useEmployeeMutation, useEmployeeQuery } from "@/lib/api/hooks/employee"
import { DynamicTable, type DynamicTableColumn } from "@/components/shared/dynamic-table"
import type { UserResponse, UserStatus } from "../../../../../types/employee"
import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Pencil, Plus, Search, Shield, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getImageUrl } from "@/lib/image-url"
import Image from "next/image"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"
import { useRoleMutation, useRoleQuery } from "@/lib/api/hooks/role"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function EmployeesPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<UserStatus | "">("")
    const { updateStatus, delete: deleteEmployee } = useEmployeeMutation()
    const limit = 5
    const { data, isPending, isError, error } = useEmployeeQuery({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
    })

    const { assignRoleToUser } = useRoleMutation()
    const rolesQuery = useRoleQuery({
        page: 1,
        limit: 100,
    })
    const [employeeForRole, setEmployeeForRole] = useState<UserResponse | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState("")

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

    const handleDelete = async (employee: UserResponse) => {
        const confirmed = await toast.confirm(`Delete employee "${employee.name}"?`, {
            description: "This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        })
        console.log('cs', confirmed);
        if (!confirmed) return
        try {
            await deleteEmployee.mutateAsync(employee.id)
            toast.success("Employee deleted successfully")
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        }
    }

    const handleAssignRole = async () => {
        if (!employeeForRole || !selectedRoleId) return
        try {
            await assignRoleToUser.mutateAsync({
                userId: employeeForRole.id,
                payload: { roleId: selectedRoleId },
            })
            toast.success("Role assigned to employee successfully")
            setEmployeeForRole(null)
            setSelectedRoleId("")
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
        {
            key: "roles",
            header: "Role Name",
            render: (_value, employee) => (
                <span>{employee.roles?.name ?? "No role assigned"}</span>
            ),
        },
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
        },
        {
            key: "id",
            header: "Actions",
            render: (_value, employee) => (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label={`Actions for ${employee.name}`}
                        className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    >
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer" render={<Link href={`/dashboard/tenant-dashboard/employees/update/${employee.id}`} />}>
                            <Pencil aria-hidden="true" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                setEmployeeForRole(employee)
                                setSelectedRoleId("")
                            }}
                        >
                            <Shield aria-hidden="true" />
                            Assign to role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            disabled={deleteEmployee.isPending}
                            onClick={() => void handleDelete(employee)}
                        >
                            <Trash2 aria-hidden="true" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },

    ]

    return (
        <section className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Employees</h1>
                <p className="text-sm text-muted-foreground">
                    View and manage your employees.
                </p>
            </div>

            <Dialog open={Boolean(employeeForRole)} onOpenChange={(open) => !open && setEmployeeForRole(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Assign role</DialogTitle>
                        <DialogDescription>Select a role for {employeeForRole?.name}.</DialogDescription>
                    </DialogHeader>
                    {rolesQuery.isError ? (
                        <p className="text-sm text-destructive">Could not load roles: {rolesQuery.error.message}</p>
                    ) : (
                        <div className="space-y-4">
                            <select
                                value={selectedRoleId}
                                onChange={(event) => setSelectedRoleId(event.target.value)}
                                disabled={rolesQuery.isPending}
                                aria-label="Select role"
                                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                            >
                                <option value="">{rolesQuery.isPending ? "Loading roles..." : "Select a role"}</option>
                                {rolesQuery.data?.data.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    disabled={!selectedRoleId || assignRoleToUser.isPending}
                                    onClick={() => void handleAssignRole()}
                                    className="cursor-pointer"
                                >
                                    {assignRoleToUser.isPending ? "Assigning..." : "Assign role"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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
