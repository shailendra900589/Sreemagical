import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { memberPanelHref } from "@/lib/admin-member-links";

/** Shared ledger layout so Enrollments / Commissions don't jump size on navigate */
export function AdminLedgerPage({ children }: { children: ReactNode }) {
  return <div className="admin-ledger-page flex min-h-[calc(100vh-8rem)] flex-col">{children}</div>;
}

export function AdminTableShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-table-wrap -mx-1 overflow-x-auto px-1">
      <table className="admin-table w-full min-w-[880px] table-fixed text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminThead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 z-[1] border-b border-slate-200 bg-slate-50/95 text-[11px] uppercase tracking-wide text-slate-500 backdrop-blur-sm">
      {children}
    </thead>
  );
}

export function AdminTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <th className={cn("whitespace-nowrap px-3 py-3 font-semibold", className)}>{children}</th>;
}

export function AdminTr({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">{children}</tr>
  );
}

export function AdminTd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn("px-3 py-3 align-middle", className)}>{children}</td>;
}

export function AdminMemberCell({
  memberId,
  name,
  memberCode,
  email,
}: {
  memberId: string;
  name: string;
  memberCode: string;
  email?: string;
}) {
  return (
    <div className="min-w-0">
      <Link
        href={`/admin/members/${memberId}`}
        className="block truncate font-medium text-[#001a40] hover:underline"
      >
        {name}
      </Link>
      <p className="mt-0.5 truncate text-xs text-slate-400">
        {memberCode}
        {email ? ` · ${email}` : ""}
      </p>
    </div>
  );
}

export function AdminPanelLink({ memberId, label = "Panel" }: { memberId: string; label?: string }) {
  return (
    <a
      href={memberPanelHref(memberId)}
      className="admin-action-btn inline-flex h-8 w-[4.75rem] shrink-0 items-center justify-center rounded-full bg-[#001a40] px-3 text-[11px] font-semibold text-white hover:bg-[#002b5c]"
    >
      {label}
    </a>
  );
}

export function PackageBadge({ packageType }: { packageType: "EDU" | "BP" | string }) {
  const isBp = packageType === "BP";
  return (
    <span
      className={cn(
        "inline-flex min-w-[2.75rem] justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isBp ? "bg-emerald-50 text-emerald-800" : "bg-sky-50 text-sky-800",
      )}
    >
      {packageType}
    </span>
  );
}

export function LedgerStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const tone =
    normalized === "COMPLETED"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : normalized === "PENDING"
        ? "bg-amber-50 text-amber-900 ring-amber-100"
        : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        tone,
      )}
    >
      {normalized}
    </span>
  );
}

/** Always 4 equal KPI slots — prevents width jump between ledger pages */
export function AdminStatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="admin-stat-grid mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {children}
    </div>
  );
}

/** Always 3 equal secondary cards under KPIs */
export function AdminSubStatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="admin-substat-grid mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>
  );
}

export function AdminSubStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-h-[5.25rem] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold text-[#001a40]">{value}</p>
      {hint ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  );
}
