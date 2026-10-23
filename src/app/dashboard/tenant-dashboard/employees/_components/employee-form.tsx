"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SelectImage from "@/components/shared/select-image"

export type EmployeeFormValues = {
  name: string
  email: string
  password: string
  phone: string
  photo?: string
}

type EmployeeFormProps = {
  mode: "create" | "update"
  initialValues?: EmployeeFormValues
  isPending?: boolean
  onSubmit: (values: EmployeeFormValues) => Promise<void>
}

const emptyValues: EmployeeFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  photo: undefined,
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

const employeesUrl = "/dashboard/tenant-dashboard/employees"

export default function EmployeeForm({ mode, initialValues, isPending = false, onSubmit }: EmployeeFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const values = initialValues ?? emptyValues
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({ defaultValues: values })

  useEffect(() => {
    reset(values)
  }, [reset, values])

  const submit: SubmitHandler<EmployeeFormValues> = async (formValues) => onSubmit(formValues)
  const isUpdate = mode === "update"

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{isUpdate ? "Update employee" : "Create employee"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isUpdate ? "Update the employee's account and contact details." : "Enter the employee's account and contact details."}
        </p>
      </div>

      <form className="space-y-6 rounded-xl border bg-card p-5 sm:p-6" onSubmit={handleSubmit(submit)} noValidate>
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
              required: name === "password" && isUpdate ? false : `${label} is required.`,
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
                  {label}{(name !== "password" || !isUpdate) && <span className="text-destructive" aria-hidden="true"> *</span>}
                  {name === "password" && isUpdate && <span className="text-muted-foreground"> (leave blank to keep current)</span>}
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
                      className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
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
                {errors[name] && <p id={`${name}-error`} className="mt-1.5 text-sm text-destructive">{errors[name]?.message}</p>}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => reset(values)}>
            Reset
          </Button>
          <Link href={employeesUrl} className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted">
            Cancel
          </Link>
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting || isPending}>
            {isSubmitting || isPending ? (isUpdate ? "Saving..." : "Creating...") : (isUpdate ? "Save changes" : "Create employee")}
          </Button>
        </div>
      </form>
    </section>
  )
}
