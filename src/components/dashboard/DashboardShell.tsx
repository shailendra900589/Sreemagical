"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "मुख्य पृष्ठ", en: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/business", label: "व्यवसाय", en: "Business", icon: Briefcase },
  { href: "/dashboard/team", label: "टीम और लेवल", en: "My Team", icon: Network },
  { href: "/dashboard/courses", label: "कोर्स / शिक्षा", en: "Courses", icon: BookOpen },
  { href: "/dashboard/royalty", label: "रॉयल्टी क्लब", en: "Royalty", icon: Crown },
  { href: "/dashboard/wallet", label: "वॉलेट", en: "Wallet", icon: Wallet },
];

export function DashboardShell({
  children,
  userName,
  packageLabel,
  memberCode,
  impersonating = false,
}: {
  children: React.ReactNode;
  userName: string;
  packageLabel: string;
  memberCode?: string;
  impersonating?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-0.5 p-2">
      {items.map(({ href, label, en, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "sm-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5",
              active ? "bg-[#001a40] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                active ? "bg-white/10 text-[#d4af37]" : "bg-slate-100 text-slate-500",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-tight">{label}</span>
              <span className={cn("block text-[11px]", active ? "text-white/60" : "text-slate-400")}>
                {en}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#001a40] text-white shadow-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-3 sm:h-16 sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              className="sm-press inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0d878] text-sm font-bold text-[#001a40] shadow-inner sm:h-10 sm:w-10">
                M
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold tracking-wide">Sri Magicale</p>
                <p className="hidden text-[11px] text-white/65 sm:block">Powered by SM Groups</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="hidden text-right md:block">
              <p className="text-sm font-medium">स्वागत है, {userName}</p>
              {memberCode ? <p className="text-[11px] text-white/55">{memberCode}</p> : null}
            </div>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                packageLabel === "BP"
                  ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30"
                  : "bg-sky-400/20 text-sky-100 ring-1 ring-sky-300/30",
              )}
            >
              {packageLabel}
            </span>

            {impersonating ? (
              <form action="/api/admin/impersonate/exit" method="post">
                <button
                  type="submit"
                  className="sm-press inline-flex items-center gap-1.5 rounded-full bg-amber-400/90 px-2.5 py-1.5 text-xs font-semibold text-[#001a40] hover:bg-amber-300 sm:px-3"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Exit admin view</span>
                </button>
              </form>
            ) : (
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="sm-press inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 sm:px-3"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {open ? (
          <div className="border-t border-white/10 bg-[#001530] px-3 py-3 lg:hidden">
            <div className="overflow-hidden rounded-2xl bg-white text-slate-800 shadow-lg">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-5 md:gap-6 md:px-6 md:py-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
        <aside className="hidden h-fit lg:sticky lg:top-[88px] lg:block">
          <div className="sm-animate-fade overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-[#001a40]/[0.03] to-transparent px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Member Menu
              </p>
            </div>
            <NavLinks />
          </div>
        </aside>

        <main className="sm-animate-in min-w-0 pb-10">{children}</main>
      </div>
    </div>
  );
}
