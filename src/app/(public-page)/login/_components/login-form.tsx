"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    setMessage("Login API is not connected yet.");
    console.log('value', values);
    api.post('/auth/login', values)
    .then(res => console.log(res))
    .catch(err => console.log(err))
  };

  const inputClassName =
    "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

  return (
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
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password", { required: "Password is required." })}
          className={inputClassName}
        />
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
  );
}
