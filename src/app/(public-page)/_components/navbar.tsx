"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
  { label: "Products", href: "#products" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="Ratnahar home"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-sm text-white">
            R
          </span>
          Ratnahar
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>

        <div
          id="mobile-navigation"
          className={`${menuOpen ? "block" : "hidden"} absolute left-4 right-4 top-full z-50 rounded-xl border border-slate-200 bg-white p-3 shadow-lg lg:hidden`}
        >
          <div className="flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3 border-t border-slate-200 pt-4">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
