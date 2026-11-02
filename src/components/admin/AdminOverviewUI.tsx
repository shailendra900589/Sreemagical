import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpen,
  Crown,
  GitBranch,
  GraduationCap,
  Percent,
  Receipt,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PackageBadge } from "@/components/admin/admin-ui";

export { GraduationCap };

export function AdminOverviewHero({
  activeMembers,
  totalMembers,
  turnoverLabel,
  offerActive,
  offerPct,
}: {
  activeMembers: number;
  totalMembers: number;
  turnoverLabel: string;
  offerActive: boolean;
  offerPct: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#001a40]/10 bg-gradient-to-br from-[#001a40] via-[#002b5c] to-[#001530] p-5 text-white shadow-[0_20px_50px_-24px_rgba(0,26,64,0.55)] sm:p-6 md:p-7">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d4af37]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            Live control panel
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Admin Overview</h1>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Members, enrollments, payouts aur compensation — ek jagah se manage karein. Real-time
            snapshot of SM Groups network.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              {activeMembers} / {totalMembers} active members
            </span>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-100">
              Turnover {turnoverLabel}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                offerActive ? "bg-[#d4af37]/25 text-[#fff3c4]" : "bg-white/10 text-white/75",
              )}
            >
              Direct offer {offerActive ? "ON" : "OFF"} · {offerPct}% ready
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Users className="h-4 w-4" />
            Members
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-[#001a40] shadow-lg shadow-[#d4af37]/20 hover:bg-[#e0bc4a]"
          >
            <Percent className="h-4 w-4" />
            Compensation %
          </Link>
        </div>
      </div>
    </div>
  );
}

const toneStyles = {
  navy: {
    card: "from-[#001a40]/[0.06] via-white to-white border-[#001a40]/12",
    value: "text-[#001a40]",
    icon: "bg-[#001a40] text-[#d4af37] shadow-[#001a40]/25",
    bar: "from-[#001a40] to-[#003366]",
  },
  gold: {
    card: "from-[#d4af37]/15 via-[#fffbeb] to-white border-[#d4af37]/35",
    value: "text-[#9a7b1a]",
    icon: "bg-gradient-to-br from-[#d4af37] to-[#c49a2a] text-[#001a40] shadow-[#d4af37]/35",
    bar: "from-[#d4af37] to-[#f0d878]",
  },
  emerald: {
    card: "from-emerald-500/10 via-white to-white border-emerald-200/90",
    value: "text-emerald-800",
    icon: "bg-emerald-600 text-white shadow-emerald-600/25",
    bar: "from-emerald-500 to-teal-400",
  },
  sky: {
    card: "from-sky-500/10 via-white to-white border-sky-200/90",
    value: "text-sky-900",
    icon: "bg-sky-600 text-white shadow-sky-600/25",
    bar: "from-sky-500 to-cyan-400",
  },
} as const;

export function AdminMetricsSection({
  title,
  subtitle,
  children,
  columns = 4,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  columns?: 3 | 4;
}) {
  return (
    <section aria-label={title} className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">
            {title}
          </p>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          columns === 4
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function AdminKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof toneStyles;
}) {
  const t = toneStyles[tone];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)] sm:p-5",
        t.card,
      )}
    >
      <div
        className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90", t.bar)}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl transition-opacity group-hover:opacity-80"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 truncate text-2xl font-semibold tracking-tight sm:text-[1.7rem]",
              t.value,
            )}
          >
            {value}
          </p>
          {hint ? (
            <p className="mt-1.5 truncate text-xs leading-5 text-slate-500">{hint}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ring-1 ring-white/50",
            t.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminRecentMembers({
  members,
}: {
  members: {
    memberCode: string;
    name: string;
    packageType: "EDU" | "BP" | null;
    sponsor: { memberCode: string } | null;
  }[];
}) {
  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-10 text-center">
        <Users className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm font-medium text-slate-600">No members yet</p>
        <p className="mt-1 text-xs text-slate-400">First signup will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {members.map((m) => (
        <li
          key={m.memberCode}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 transition-colors hover:border-[#d4af37]/30 hover:bg-white"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#001a40] to-[#003366] text-xs font-bold text-[#d4af37]">
            {memberInitials(m.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#001a40]">{m.name}</p>
            <p className="truncate text-xs text-slate-400">
              {m.memberCode}
              {m.sponsor ? ` · ↑ ${m.sponsor.memberCode}` : ""}
            </p>
          </div>
          {m.packageType ? (
            <PackageBadge packageType={m.packageType} />
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function AdminRecentCommissions({
  rows,
}: {
  rows: {
    id: string;
    amount: number;
    type: string;
    level: number | null;
    recipient: { name: string; memberCode: string };
  }[];
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-10 text-center">
        <Wallet className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm font-medium text-slate-600">No payouts yet</p>
        <p className="mt-1 text-xs text-slate-400">BP joinings trigger commission ledger rows.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map((c) => (
        <li
          key={c.id}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 hover:border-emerald-200/80 hover:bg-white"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#001a40]">{c.recipient.name}</p>
            <p className="truncate text-xs text-slate-400">
              {c.type.replaceAll("_", " ")}
              {c.level ? ` · L${c.level}` : ""}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold text-emerald-700">
            +₹{c.amount.toLocaleString("en-IN")}
          </span>
        </li>
      ))}
    </ul>
  );
}

const modules: {
  href: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    href: "/admin/members",
    label: "Members",
    detail: "Packages · live panel · dossiers",
    icon: Users,
    accent: "bg-[#001a40]/10 text-[#001a40]",
  },
  {
    href: "/admin/enrollments",
    label: "Enrollments",
    detail: "Joinings & fee ledger",
    icon: Receipt,
    accent: "bg-sky-500/10 text-sky-800",
  },
  {
    href: "/admin/commissions",
    label: "Commissions",
    detail: "Direct · level · royalty",
    icon: Wallet,
    accent: "bg-emerald-500/10 text-emerald-800",
  },
  {
    href: "/admin/settings",
    label: "Compensation",
    detail: "% rates & package fees",
    icon: Percent,
    accent: "bg-[#d4af37]/15 text-[#9a7b1a]",
  },
  {
    href: "/admin/team",
    label: "Team tree",
    detail: "Drag-drop structure",
    icon: GitBranch,
    accent: "bg-violet-500/10 text-violet-800",
  },
  {
    href: "/admin/royalty",
    label: "Royalty cycle",
    detail: "Club pool distribution",
    icon: Crown,
    accent: "bg-amber-500/10 text-amber-900",
  },
  {
    href: "/admin/courses",
    label: "Courses",
    detail: "LMS & lesson videos",
    icon: BookOpen,
    accent: "bg-rose-500/10 text-rose-800",
  },
];

export function AdminModuleGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {modules.map(({ href, label, detail, icon: Icon, accent }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] hover:border-[#d4af37]/45 hover:shadow-[0_8px_24px_-12px_rgba(0,26,64,0.15)]"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
              accent,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-[#001a40]">{label}</p>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-[#9a7b1a]" />
            </div>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">{detail}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function AdminViewAllLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#001a40] hover:border-[#d4af37]/40 hover:bg-[#fffbeb]"
    >
      {children}
      <ArrowUpRight className="h-3 w-3" />
    </Link>
  );
}
