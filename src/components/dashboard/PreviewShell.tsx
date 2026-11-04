"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  Crown,
  Eye,
  LayoutDashboard,
  Menu,
  Network,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { slug: "", label: "मुख्य पृष्ठ", en: "Dashboard", icon: LayoutDashboard },
  { slug: "business", label: "व्यवसाय", en: "Business", icon: Briefcase },
  { slug: "team", label: "टीम और लेवल", en: "My Team", icon: Network },
  { slug: "courses", label: "कोर्स / शिक्षा", en: "Courses", icon: BookOpen },
  { slug: "royalty", label: "रॉयल्टी क्लब", en: "Royalty", icon: Crown },
  { slug: "wallet", label: "वॉलेट", en: "Wallet", icon: Wallet },
];

export function PreviewShell({
  children,
  pkg,
  userName,
  packageLabel,
  memberCode,
}: {
  children: React.ReactNode;
  pkg: "edu" | "bp";
  userName: string;
  packageLabel: string;
  memberCode: string;
}) {
  const pathname = usePathname();
  const base = `/preview/${pkg}`;
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-0.5 p-2">
      {sections.map(({ slug, label, en, icon: Icon }) => {
        const href = slug ? `${base}/${slug}` : base;
        const active =
          slug === ""
            ? pathname === base
            : pathname === href || pathname.startsWith(`${href}/`);
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
      <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-950 sm:px-4 sm:text-sm">
        <span className="inline-flex flex-wrap items-center justify-center gap-1.5 font-medium">
          <Eye className="h-3.5 w-3.5" />
          Preview mode — login required nahi.{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>{" "}
          /{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </span>
      </div>

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
            <Link href={base} className="flex min-w-0 items-center gap-2.5">
              <BrandLogo size={40} className="ring-white/15" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold tracking-wide">Sri Magicale</p>
                <p className="hidden text-[11px] text-white/65 sm:block">
                  {pkg === "bp" ? "BP package preview" : "Edu package preview"}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-[11px] text-white/55">{memberCode}</p>
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
            <Link
              href={pkg === "bp" ? "/preview/edu" : "/preview/bp"}
              className="sm-press hidden rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 sm:inline-flex"
            >
              {pkg === "bp" ? "Edu" : "BP"}
            </Link>
            <Link
              href="/login"
              className="sm-press rounded-full bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-[#001a40]"
            >
              Login
            </Link>
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
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Preview menu
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
