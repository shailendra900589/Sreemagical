"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthField, AuthShell } from "@/components/auth/AuthShell";

export function SignupForm() {
  const router = useRouter();
  const search = useSearchParams();
  const defaultPackage = search.get("package") === "EDU" ? "EDU" : "BP";
  const sponsorSignup = search.get("Signup") ?? search.get("signup") ?? "";
  const leg = search.get("Leg") ?? search.get("leg") ?? "L";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        password: form.get("password"),
        packageType: form.get("packageType"),
        sponsorRef: sponsorSignup || undefined,
        leg: leg === "R" ? "R" : "L",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Registration failed");
      return;
    }
    router.push(data.redirect ?? "/dashboard");
  }

  return (
    <AuthShell
      eyebrow="New Membership"
      title="Sri Magicale se juden"
      subtitle="Edu ya Business Purpose package choose karke learning — aur BP par earnings — shuru karein."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">
          Create account
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#001a40]">Join Sri Magicale</h2>
        <p className="mt-1.5 text-sm text-slate-500">Education & Youth Empowerment Mission</p>
      </div>

      {sponsorSignup ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
          Referral link detected · Placement leg: <strong>{leg === "R" ? "Right" : "Left"}</strong>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
        <AuthField label="Full name" name="name" placeholder="Your full name" required />
        <AuthField label="Email" name="email" type="email" placeholder="you@example.com" required />
        <AuthField label="Phone (optional)" name="phone" placeholder="+91 XXXXX XXXXX" />
        <AuthField
          label="Password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          required
          minLength={6}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Package</span>
          <select
            name="packageType"
            defaultValue={defaultPackage}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#001a40] outline-none focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/25"
          >
            <option value="EDU">Education Package — ₹5,000 (learning only)</option>
            <option value="BP">Business Purpose — ₹10,000 (Edu + income)</option>
          </select>
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#d4af37] py-3 text-sm font-semibold text-[#001a40] shadow-md transition hover:bg-[#e0c15a] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Complete joining"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already a member?{" "}
        <Link href="/login" className="font-semibold text-[#001a40] underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
