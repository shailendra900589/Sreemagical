"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Crown,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Percent,
  Receipt,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

const nav = [
  { href: "/admin", label: "Overview", en: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", en: "Users & packages", icon: Users },
  { href: "/admin/enrollments", label: "Enrollments", en: "Joinings & fees", icon: Receipt },
  { href: "/admin/commissions", label: "Commissions", en: "Payout ledger", icon: Wallet },
  { href: "/admin/settings", label: "Compensation", en: "Referral · Level · Royalty %", icon: Percent },
  { href: "/admin/team", label: "Team tree", en: "Insert member / level", icon: GitBranch },
  { href: "/admin/royalty", label: "Royalty cycle", en: "Distribute club pool", icon: Crown },
  { href: "/admin/courses", label: "Courses", en: "LMS modules", icon: BookOpen },
];

export function AdminShell({
  children,
  adminName,
  adminEmail,
}: {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#001a40] text-white shadow-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0d878] text-sm font-bold text-[#001a40] sm:h-10 sm:w-10">
              M
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Sri Magicale Admin</p>
              <p className="hidden text-[11px] text-white/60 sm:block">SM Groups control panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm sm:gap-3">
            <div className="hidden text-right md:block">
              <p className="font-medium">{adminName}</p>
              <p className="text-[11px] text-white/55">{adminEmail}</p>
            </div>
            <Link
              href="/"
              className="hidden rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 sm:inline-flex"
            >
              Public site
            </Link>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[#001a40]/50 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,280px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-[#001a40]">Admin menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
              {nav.map((item) => (
                <AdminNavLink key={item.href} {...item} onNavigate={() => setOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1440px] gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-5 md:gap-6 md:px-6 md:py-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
        <aside className="hidden h-fit lg:sticky lg:top-[4.25rem] lg:block xl:top-16">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Admin menu
              </p>
            </div>
            <nav className="space-y-0.5 p-2">
              {nav.map((item) => (
                <AdminNavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>
        </aside>
        <main className="admin-page min-w-0 pb-12">{children}</main>
      </div>
    </div>
  );
}
