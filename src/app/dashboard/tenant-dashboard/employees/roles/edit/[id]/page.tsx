"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/api"
import { useRoleByIdQuery, useRoleMutation } from "@/lib/api/hooks/role"
import { toast } from "@/lib/toast"
import type { CreateRolePayload } from "../../../../../../../../types/role"

function UpdateRoleContent() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { data, isPending, isError, error } = useRoleByIdQuery(id)
    const { update } = useRoleMutation()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CreateRolePayload>({
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            isSystemRole: false
        },
    })

    useEffect(() => {
        if (data?.data) {
            reset({
                name: data.data.name,
                slug: data.data.slug,
                description: data.data.description ?? "",
                isSystemRole: data.data.isSystemRole,
            })
        }
    }, [data, reset])

    const onSubmit: SubmitHandler<CreateRolePayload> = async (values) => {
        try {
            await update.mutateAsync({ id, payload: values })
            toast.success("Role updated successfully")
            router.push("/dashboard/tenant-dashboard/employees/roles")
        } catch (submitError) {
            toast.error(getApiErrorMessage(submitError))
        }
    }

    if (isPending) return <p className="text-sm text-muted-foreground">Loading role...</p>
    if (isError) return <p className="text-sm text-destructive">Could not load role: {error.message}</p>
    if (!data?.data) return <p className="text-sm text-muted-foreground">Role not found.</p>

    return (
        <section className="mx-auto w-full max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Edit role</h1>
                <p className="mt-1 text-sm text-muted-foreground">Update the role details.</p>
            </div>

            <form className="space-y-6 rounded-xl border bg-card p-5 sm:p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                    {([
                        { name: "name", label: "Role name", placeholder: "Gallery Manager" },
                        { name: "slug", label: "Slug", placeholder: "gallery-manager" },
                    ] as const).map(({ name, label, placeholder }) => (
                        <div key={name}>
                            <label htmlFor={name} className="mb-2 block text-sm font-medium">{label}</label>
                            <Input
                                id={name}
                                placeholder={placeholder}
                                aria-invalid={Boolean(errors[name])}
                                {...register(name, { required: `${label} is required.` })}
                            />
                            {errors[name] && <p className="mt-1.5 text-sm text-destructive">{errors[name]?.message}</p>}
                        </div>
                    ))}

                    <div className="sm:col-span-2">
                        <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            id="description"
                            className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            placeholder="Can manage gallery content"
                            {...register("description", { required: "Description is required." })}
                        />
                        {errors.description && <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
                        <input type="checkbox" className="size-4 accent-primary" {...register("isSystemRole")} />
                        System role
                    </label>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                    <Link href="/dashboard/tenant-dashboard/employees/roles" className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted">
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isSubmitting || update.isPending}>
                        {isSubmitting || update.isPending ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default function UpdateRolePage() {
    return (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading role...</p>}>
            <UpdateRoleContent />
        </Suspense>
    )
}
