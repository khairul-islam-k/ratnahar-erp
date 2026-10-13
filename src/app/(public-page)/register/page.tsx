import Image from "next/image";
import RegisterForm from "./_components/register-form";

export default function RegisterPage() {
  return (
    <section className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:min-h-[680px] lg:grid-cols-2">
        <div className="relative flex min-h-64 flex-col justify-end overflow-hidden p-7 text-white sm:min-h-80 sm:p-10 lg:min-h-full lg:p-12">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85"
            alt="A bright, modern team workspace"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/45 to-slate-900/10" />
          <div className="relative z-10 max-w-md">
            <span className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
              Ratnahar ERP
            </span>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Bring your business into focus.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80 sm:text-base">
              Create your workspace and keep your team, operations, and growth
              moving together.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
          <div className="w-full max-w-md">
            <p className="text-sm font-semibold text-emerald-700">Get started</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your details to set up your business workspace.
            </p>
            <div className="mt-8">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
