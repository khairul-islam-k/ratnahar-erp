"use client"

import { Suspense, useEffect, useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import { useRoleMutation, useRolePermissionsQuery } from "@/lib/api/hooks/role"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"
import { usePermissionQuery } from "@/lib/api/hooks/permission"
import { Button } from "@base-ui/react"

function AssignPermissionContent() {
  const { id } = useParams<{ id: string }>()
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const { assignPermissions } = useRoleMutation()
  const rolePermissionsQuery = useRolePermissionsQuery(id)
  const permissionsQuery = usePermissionQuery()
  useEffect(() => {
    if (rolePermissionsQuery.data) {
      setSelectedPermissionIds(rolePermissionsQuery.data.data.map(({ permissionId }) => permissionId))
    }
  }, [rolePermissionsQuery.data])
  const permissions = permissionsQuery.data?.data ?? []
  const permissionsByFeature = permissions.reduce<Record<string, typeof permissions>>((groups, permission) => {
    if (!groups[permission.featureKey]) groups[permission.featureKey] = []
    groups[permission.featureKey].push(permission)
    return groups
  }, {})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedPermissionIds.length === 0) return

    const payload = selectedPermissionIds.map((permissionId) => ({ roleId: id, permissionId }));
    try {
      await assignPermissions.mutateAsync(payload)
      toast.success("Permissions assigned to role successfully")
      setSelectedPermissionIds([])
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <section className="max-w-xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Assign permissions</h1>
        <p className="text-sm text-muted-foreground">Choose the permissions to assign to this role.</p>
      </div>

      {rolePermissionsQuery.isPending || permissionsQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Loading permissions...</p>
      ) : rolePermissionsQuery.isError ? (
        <p className="text-sm text-destructive">Could not load this role&apos;s permissions: {rolePermissionsQuery.error.message}</p>
      ) : permissionsQuery.isError ? (
        <p className="text-sm text-destructive">Could not load permissions: {permissionsQuery.error.message}</p>
      ) : permissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No permissions available.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {Object.entries(permissionsByFeature).map(([featureKey, featurePermissions]) => (
              <fieldset key={featureKey} className="rounded-lg border p-4">
                <legend className="px-1 font-semibold">{featureKey}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {featurePermissions.map((permission) => (
                    <label key={permission.id} className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedPermissionIds.includes(permission.id)}
                        onChange={(event) => {
                          setSelectedPermissionIds((current) => event.target.checked
                            ? [...current, permission.id]
                            : current.filter((permissionId) => permissionId !== permission.id))
                        }}
                        className="mt-0.5 size-4 accent-primary"
                      />
                      <span>
                        <span className="block font-medium">{permission.actionKey}</span>
                        <span className="text-muted-foreground">{permission.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <Button type="submit" disabled={assignPermissions.isPending || selectedPermissionIds.length === 0}>
            {assignPermissions.isPending ? "Assigning..." : "Assign selected permissions"}
          </Button>
        </form>
      )}
    </section>
  )
}

const AssignPermissionPage = () => (
  <Suspense fallback={<p className="text-sm text-muted-foreground">Loading role...</p>}>
    <AssignPermissionContent />
  </Suspense>
)

export default AssignPermissionPage
