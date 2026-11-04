"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { AuthField, AuthShell } from "@/components/auth/AuthShell";
import { loginDemoList } from "@/lib/demo-accounts";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.push(search.get("next") ?? data.redirect ?? "/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Member Access"
      title="शिक्षा भी, रोज़गार भी!"
      subtitle="Sri Magicale member portal — courses, team, wallet aur royalty club ek jagah."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">
          Welcome back
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#001a40]">Member Login</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Apna registered email aur password se sign in karein.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <AuthField label="Email address" name="email" type="email" placeholder="you@example.com" required />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-11 text-sm text-[#001a40] outline-none transition placeholder:text-slate-400 focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#001a40] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#002b5c] disabled:opacity-60"
        >
          <Lock className="h-4 w-4" />
          {loading ? "Signing in…" : "Sign in to dashboard"}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <p className="text-center text-sm text-slate-600">
          New member?{" "}
          <Link href="/signup" className="font-semibold text-[#001a40] underline-offset-2 hover:underline">
            Join Sri Magicale
          </Link>
        </p>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Demo login</p>
          <ul className="mt-3 space-y-3 text-xs text-slate-600">
            {loginDemoList.map((account) => (
              <li key={account.email} className="rounded-xl border border-white bg-white/80 px-3 py-2.5">
                <p className="font-semibold text-[#001a40]">{account.label}</p>
                {"hint" in account && account.hint ? (
                  <p className="mt-0.5 text-[11px] text-slate-500">{account.hint}</p>
                ) : null}
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-slate-700">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#9a7b1a]" aria-hidden />
                  <span>{account.email}</span>
                  <span className="text-slate-300">·</span>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-[#9a7b1a]" aria-hidden />
                  <span>{account.password}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-5 text-slate-500">
            Purana BP login bhi chalega: demo@srimagicale.in / demo123
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
