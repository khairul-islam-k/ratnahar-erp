"use client";

import { useAuthStore } from "@/app/stores/auth.store";
import Link from "next/link";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { LoginPayload, type AuthUser } from "../../../../../types/auth";
import { authApi } from "@/lib/api/auth";
import { toast } from "@/lib/toast";
import { getApiErrorMessage } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import RoleRedirect from "./role-redirect";

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [redirectUserType, setRedirectUserType] = useState<AuthUser["type"] | null>(null);
  const setAuth = useAuthStore(s => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit: SubmitHandler<LoginPayload> = async (values) => {
    setMessage("");

    try {
      const res = await authApi.login(values);
      setAuth(res);
      toast.success("Login successful");
      setRedirectUserType(res.user.type);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
    
  };

  const inputClassName =
    "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

  return (
    <>
    {redirectUserType && <RoleRedirect userType={redirectUserType} />}
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address <span className="text-rose-600" aria-label="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="john@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email", {
            required: "Email address is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
          className={inputClassName}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-rose-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password <span className="text-rose-600" aria-label="required">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password", { required: "Password is required." })}
            className={`${inputClassName} pr-12`}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-pressed={passwordVisible}
            className="absolute right-0 top-2 grid h-12 w-11 place-items-center rounded-r-xl text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-2 text-sm text-rose-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Log in
      </button>

      <p aria-live="polite" className="min-h-5 text-center text-sm text-slate-600">
        {message}
      </p>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Create one
        </Link>
      </p>
    </form>
    </>
  );
}
