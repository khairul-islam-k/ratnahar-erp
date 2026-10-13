"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
};

const requiredMark = (
  <span className="text-rose-600" aria-label="required">
    *
  </span>
);

export default function RegisterForm() {
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit: SubmitHandler<RegisterFormValues> = (values) => {
    // React Hook Form provides all validated field values here for the API call.
    void values;
    console.log('values', values);
    setMessage("Your details are valid. Registration API is not connected yet.");
  };

  const inputClassName =
    "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Name {requiredMark}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="John"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name", { required: "Name is required." })}
          className={inputClassName}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-rose-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address {requiredMark}
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
          Password {requiredMark}
        </label>
        <div className="relative">
          <input
            id="password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-hint"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
            })}
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
        <p
          id="password-hint"
          className={`mt-2 text-xs ${errors.password ? "text-rose-600" : "text-slate-500"}`}
        >
          {errors.password?.message ?? "Use at least 8 characters."}
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-slate-700"
        >
          Confirm password {requiredMark}
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your password again"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match.",
            })}
            className={`${inputClassName} pr-12`}
          />
          <button
            type="button"
            onClick={() => setConfirmPasswordVisible((visible) => !visible)}
            aria-label={
              confirmPasswordVisible ? "Hide confirm password" : "Show confirm password"
            }
            aria-pressed={confirmPasswordVisible}
            className="absolute right-0 top-2 grid h-12 w-11 place-items-center rounded-r-xl text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="mt-2 text-sm text-rose-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessName"
          className="text-sm font-medium text-slate-700"
        >
          Business name {requiredMark}
        </label>
        <input
          id="businessName"
          type="text"
          autoComplete="organization"
          placeholder="My Business"
          aria-invalid={Boolean(errors.businessName)}
          aria-describedby={errors.businessName ? "business-name-error" : undefined}
          {...register("businessName", {
            required: "Business name is required.",
          })}
          className={inputClassName}
        />
        {errors.businessName && (
          <p id="business-name-error" className="mt-2 text-sm text-rose-600">
            {errors.businessName.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Create account
      </button>

      <p aria-live="polite" className="min-h-5 text-center text-sm text-slate-600">
        {message}
      </p>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
