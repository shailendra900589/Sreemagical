"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function RoyaltyDistributeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    const form = new FormData(e.currentTarget);
    const periodLabel = String(form.get("periodLabel") || "").trim();
    const res = await fetch("/api/admin/royalty/distribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ periodLabel: periodLabel || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Distribution failed");
      return;
    }
    setResult(
      `Distributed for ${data.periodLabel}. Turnover ₹${Number(data.totalTurnover).toLocaleString("en-IN")}. Pools: ${
        data.payouts?.map((p: { tier: string; members: number; amount: number }) => `${p.tier} (${p.members} members, ₹${Number(p.amount).toLocaleString("en-IN")})`).join(" · ") || "none"
      }`,
    );
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Period label</span>
        <input
          name="periodLabel"
          placeholder="e.g. Nov 2026"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
        />
      </label>
      <p className="text-xs leading-5 text-slate-500">
        Last 30 days BP enrollment turnover se Silver / Gold / Diamond pools calculate hote hain aur
        qualified club members ke wallet mein credit hote hain.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{result}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#001a40] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Distributing…" : "Run royalty distribution"}
      </button>
    </form>
  );
}
