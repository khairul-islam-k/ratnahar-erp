"use client"

import { Suspense, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import EmployeeForm, { type EmployeeFormValues } from "../../_components/employee-form"
import { useEmployeeByIdQuery, useEmployeeMutation } from "@/lib/api/hooks/employee"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"

function UpdateEmployeeContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, isPending, isError, error } = useEmployeeByIdQuery(id)
  const { update } = useEmployeeMutation()
  const initialValues = useMemo<EmployeeFormValues | undefined>(() => data?.data ? ({
    name: data.data.name,
    email: data.data.email,
    password: "",
    phone: data.data.phone,
    photo: data.data.photo || undefined,
  }) : undefined, [data])

  const handleUpdate = async (values: EmployeeFormValues) => {
    const { password, ...details } = values
    const payload = password ? values : details

    try {
      await update.mutateAsync({ id, payload })
      toast.success("Employee updated successfully")
      router.push("/dashboard/tenant-dashboard/employees")
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError))
    }
  }

  if (isPending) return <p className="text-sm text-muted-foreground">Loading employee...</p>
  if (isError) return <p className="text-sm text-destructive">Could not load employee: {error.message}</p>
  if (!initialValues) return <p className="text-sm text-muted-foreground">Employee not found.</p>

  return <EmployeeForm 
  mode="update" 
  initialValues={initialValues} 
  isPending={update.isPending} 
  onSubmit={handleUpdate} />
}

export default function UpdateEmployeePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading employee...</p>}>
      <UpdateEmployeeContent />
    </Suspense>
  )
}
