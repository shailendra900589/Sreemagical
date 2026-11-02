"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNavLink({
  href,
  label,
  en,
  icon: Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  en: string;
  icon: LucideIcon;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
        active
          ? "bg-[#001a40] text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-[#001a40]",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-white/10 text-[#d4af37]" : "bg-slate-100 text-slate-500",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-tight">{label}</span>
        <span className={cn("block text-[11px]", active ? "text-white/55" : "text-slate-400")}>{en}</span>
      </span>
    </Link>
  );
}
