"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MemberRowActions } from "@/components/admin/MemberRowActions";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

type MemberRow = {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  packageType: "EDU" | "BP" | null;
  clubTier: "NONE" | "SILVER" | "GOLD" | "DIAMOND";
  walletBalance: number;
  isActive: boolean;
  role: "MEMBER" | "ADMIN";
  sponsor: { memberCode: string; name: string } | null;
};

export function MembersTable({ initial }: { initial: MemberRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [pkgFilter, setPkgFilter] = useState<"" | "EDU" | "BP" | "NONE">("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((m) => {
      if (m.role === "ADMIN") return false;
      if (pkgFilter === "EDU" && m.packageType !== "EDU") return false;
      if (pkgFilter === "BP" && m.packageType !== "BP") return false;
      if (pkgFilter === "NONE" && m.packageType) return false;
      if (!query) return true;
      return (
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.memberCode.toLowerCase().includes(query) ||
        (m.sponsor?.memberCode.toLowerCase().includes(query) ?? false)
      );
    });
  }, [rows, q, pkgFilter]);

  async function patch(id: string, payload: Record<string, unknown>) {
    setSavingId(id);
    setMessage(null);
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    setSavingId(null);
    if (!res.ok) {
      setMessage("Update failed");
      return;
    }
    const data = await res.json();
    setRows((list) =>
      list.map((r) =>
        r.id === id
          ? {
              ...r,
              packageType: data.user.packageType,
              clubTier: data.user.clubTier,
              isActive: data.user.isActive,
              role: data.user.role,
            }
          : r,
      ),
    );
    setMessage("Member updated");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, code, email, sponsor…"
            className="sm-touch w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
          />
        </div>
        <select
          value={pkgFilter}
          onChange={(e) => setPkgFilter(e.target.value as typeof pkgFilter)}
          className="sm-touch rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="">All packages</option>
          <option value="EDU">EDU</option>
          <option value="BP">BP</option>
          <option value="NONE">No package</option>
        </select>
        <p className="text-xs text-slate-400 sm:ml-auto">{filtered.length} candidates</p>
      </div>

      {message && (
        <p className="sm-animate-fade rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {/* Mobile / tablet cards — button beside each candidate */}
      <div className="sm-stagger grid gap-3 lg:hidden">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            No members match this filter.
          </p>
        )}
        {filtered.map((m) => (
          <article
            key={m.id}
            className="sm-card-lift rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/members/${m.id}`}
                  className="font-semibold text-[#001a40] hover:underline"
                >
                  {m.name}
                </Link>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {m.memberCode} · {m.email}
                </p>
                {m.sponsor ? (
                  <p className="mt-0.5 text-[11px] text-slate-400">↑ {m.sponsor.memberCode}</p>
                ) : null}
              </div>
              <MemberRowActions
                memberId={m.id}
                memberCode={m.memberCode}
                memberName={m.name}
                compact
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-[11px] text-slate-500">
                Package
                <select
                  value={m.packageType ?? ""}
                  disabled={savingId === m.id}
                  onChange={(e) =>
                    patch(m.id, {
                      packageType: e.target.value === "" ? null : e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                >
                  <option value="">—</option>
                  <option value="EDU">EDU</option>
                  <option value="BP">BP</option>
                </select>
              </label>
              <label className="text-[11px] text-slate-500">
                Club
                <select
                  value={m.clubTier}
                  disabled={savingId === m.id}
                  onChange={(e) => patch(m.id, { clubTier: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                >
                  <option value="NONE">NONE</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="DIAMOND">DIAMOND</option>
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <p className="text-sm font-semibold text-[#001a40]">{formatINR(m.walletBalance)}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={savingId === m.id}
                  onClick={() => patch(m.id, { isActive: !m.isActive })}
                  className={cn(
                    "sm-press rounded-full px-2.5 py-1 text-xs font-semibold",
                    m.isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {m.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop table — Dashboard button beside each row */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 font-medium">Candidate</th>
              <th className="px-3 py-3 font-medium">Package</th>
              <th className="px-3 py-3 font-medium">Club</th>
              <th className="px-3 py-3 font-medium">Wallet</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  No members match this filter.
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr
                key={m.id}
                className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/members/${m.id}`}
                        className="font-medium text-[#001a40] hover:underline"
                      >
                        {m.name}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {m.memberCode} · {m.email}
                        {m.sponsor ? ` · ↑ ${m.sponsor.memberCode}` : ""}
                      </p>
                    </div>
                    <MemberRowActions
                      memberId={m.id}
                      memberCode={m.memberCode}
                      memberName={m.name}
                    />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={m.packageType ?? ""}
                    disabled={savingId === m.id}
                    onChange={(e) =>
                      patch(m.id, {
                        packageType: e.target.value === "" ? null : e.target.value,
                      })
                    }
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                  >
                    <option value="">—</option>
                    <option value="EDU">EDU</option>
                    <option value="BP">BP</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={m.clubTier}
                    disabled={savingId === m.id}
                    onChange={(e) => patch(m.id, { clubTier: e.target.value })}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                  >
                    <option value="NONE">NONE</option>
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                    <option value="DIAMOND">DIAMOND</option>
                  </select>
                </td>
                <td className="px-3 py-3 font-medium">{formatINR(m.walletBalance)}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    disabled={savingId === m.id}
                    onClick={() => patch(m.id, { isActive: !m.isActive })}
                    className={cn(
                      "sm-press rounded-full px-2.5 py-1 text-xs font-semibold",
                      m.isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {m.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
