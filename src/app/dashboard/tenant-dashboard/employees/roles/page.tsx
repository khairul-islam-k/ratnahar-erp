"use client"

import { DynamicTable, type DynamicTableColumn } from "@/components/shared/dynamic-table"
import { useRoleMutation, useRoleQuery } from "@/lib/api/hooks/role"
import type { RoleResponse } from "../../../../../../types/role"
import { useState } from "react"
import { Search, MoreHorizontal, Pencil, ShieldCheck, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDebounce } from "use-debounce"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const RolePage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchValue] = useDebounce(search, 1000);
  const limit = 10
  const { data, isPending, isError, error } = useRoleQuery({
    page,
    limit,
    search: searchValue,
  })
  const { delete: deleteRole } = useRoleMutation()

  const handleDelete = async (role: RoleResponse) => {
    const confirmed = await toast.confirm(`Delete the role "${role.name}"?`, {
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Keep role",
    })
    if (!confirmed) return

    try {
      await deleteRole.mutateAsync(role.id)
      toast.success("Role deleted successfully")
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError))
    }
  }

  const columns: DynamicTableColumn<RoleResponse>[] = [
    { key: "name", header: "Role" },
    { key: "slug", header: "Slug" },
    { key: "description", header: "Description", render: (value) => value || "—" },
    { key: "isSystemRole", header: "System role", render: (value) => value ? "Yes" : "No" },
    {
      key: "id",
      header: "Actions",
      render: (_value, role) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${role.name}`}
            className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
            className="cursor-pointer"
            render={<Link href={`/dashboard/tenant-dashboard/employees/roles/edit/${role.id}`} />}>
              <Pencil aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
            className="cursor-pointer"
            render={<Link href={`/dashboard/tenant-dashboard/employees/roles/permission/${role.id}`} />}>
              <ShieldCheck aria-hidden="true" />
              Assign Permission
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={deleteRole.isPending}
              onClick={() => void handleDelete(role)}
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
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">View the roles available to your organization.</p>
        </div>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading roles...</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Could not load roles: {error.message}</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={data.data}
          getRowKey={(role) => role.id}
          emptyMessage="No roles found."
          toolbar={(
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search roles..."
                  aria-label="Search roles"
                  className="pl-8"
                />
              </div>
              <div className="sm:ml-auto">
                <Link href="/dashboard/tenant-dashboard/employees/roles/create">
                  <Button className="cursor-pointer">
                    <Plus aria-hidden="true" />
                    Create role
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

export default RolePage
