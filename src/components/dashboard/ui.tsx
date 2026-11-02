import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  titleHi,
  titleEn,
  description,
  action,
}: {
  titleHi: string;
  titleEn: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#b8962e] sm:text-xs">
          {titleEn}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#001a40] sm:text-2xl">
          {titleHi}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "admin-panel rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5 md:p-6",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            {title ? <h2 className="text-base font-semibold text-[#001a40]">{title}</h2> : null}
            {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "gold";
}) {
  const valueClass =
    tone === "success"
      ? "text-emerald-700"
      : tone === "gold"
        ? "text-[#9a7b1a]"
        : "text-[#001a40]";

  return (
    <div className="min-h-[5.5rem] rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-3.5 sm:p-4">
      <p className="text-[11px] font-medium text-slate-500 sm:text-xs">{label}</p>
      <p className={cn("mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl", valueClass)}>
        {value}
      </p>
      {hint ? <p className="mt-1 truncate text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}
