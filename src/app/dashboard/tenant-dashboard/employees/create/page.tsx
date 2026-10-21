"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SelectImage from "@/components/shared/select-image"
import { useEmployeeMutation } from "@/lib/api/hooks/employee"
import { getApiErrorMessage } from "@/lib/api"
import { toast } from "@/lib/toast"

type EmployeeFormValues = {
  name: string
  email: string
  password: string
  phone: string
  photo?: string
}

const fields: {
  name: Exclude<keyof EmployeeFormValues, "photo">
  label: string
  type: string
  placeholder: string
  autoComplete: string
}[] = [
  { name: "name", label: "Full name", type: "text", placeholder: "Ruhul amin", autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", placeholder: "ruhul@gmail.com", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "Enter a password", autoComplete: "new-password" },
  { name: "phone", label: "Phone number", type: "tel", placeholder: "+8801700000000", autoComplete: "tel" },
]

export default function EmployeeCreate() {
  const router = useRouter()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const { create } = useEmployeeMutation()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>()

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (values) => {
    try {
      await create.mutateAsync(values)
      toast.success("Employee created successfully")
      reset()
      router.push("/dashboard/tenant-dashboard/employees")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create employee</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the employee&apos;s account and contact details.
        </p>
      </div>

      <form
        className="space-y-6 rounded-xl border bg-card p-5 sm:p-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-2 text-center">
          <label className="block text-sm font-medium" id="photo-label">
            Employee photo <span className="text-muted-foreground">(optional)</span>
          </label>
          <div className="mx-auto w-full max-w-xs" aria-labelledby="photo-label" aria-invalid={Boolean(errors.photo)}>
            <Controller
              name="photo"
              control={control}
              render={({ field }) => <SelectImage value={field.value} onChange={field.onChange} />}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ name, label, type, placeholder, autoComplete }) => {
            const registration = register(name, {
              required: `${label} is required.`,
              ...(name === "email" ? {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
              } : {}),
              ...(name === "password" ? {
                minLength: { value: 8, message: "Password must be at least 8 characters." },
              } : {}),
              ...(name === "phone" ? {
                pattern: { value: /^\+?[\d\s()-]{7,20}$/, message: "Enter a valid phone number." },
              } : {}),
            })

            return (
              <div key={name}>
                <label htmlFor={name} className="mb-2 block text-sm font-medium">
                  {label} <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                {name === "password" ? (
                  <div className="relative">
                    <Input
                      id={name}
                      type={passwordVisible ? "text" : "password"}
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      aria-invalid={Boolean(errors[name])}
                      aria-describedby={errors[name] ? `${name}-error` : undefined}
                      className="pr-10"
                      {...registration}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((visible) => !visible)}
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                      aria-pressed={passwordVisible}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                ) : (
                  <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={errors[name] ? `${name}-error` : undefined}
                    {...registration}
                  />
                )}
                {errors[name] && (
                  <p id={`${name}-error`} className="mt-1.5 text-sm text-destructive">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Link
            href="/dashboard/tenant-dashboard/employees"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSubmitting || create.isPending}>
            {isSubmitting || create.isPending ? "Creating..." : "Create employee"}
          </Button>
        </div>
      </form>
    </section>
  )
}
