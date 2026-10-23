"use client"

import { useRouter } from "next/navigation"
import EmployeeForm, { type EmployeeFormValues } from "../_components/employee-form"
import { useEmployeeMutation } from "@/lib/api/hooks/employee"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"

export default function EmployeeCreate() {
  const router = useRouter()
  const { create } = useEmployeeMutation()

  const handleCreate = async (values: EmployeeFormValues) => {
    try {
      await create.mutateAsync(values)
      toast.success("Employee created successfully")
      router.push("/dashboard/tenant-dashboard/employees")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return <EmployeeForm 
  mode="create" 
  isPending={create.isPending} 
  onSubmit={handleCreate} />
}
