"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "गृह", en: "Home" },
  { href: "/about", label: "हमारे बारे में", en: "About" },
  { href: "/mission", label: "मिशन व विज़न", en: "Mission" },
  { href: "/courses", label: "कोर्स", en: "Courses" },
  { href: "/preview/edu", label: "Edu डैशबोर्ड", en: "Edu preview" },
  { href: "/preview/bp", label: "BP डैशबोर्ड", en: "BP preview" },
  { href: "/contact", label: "संपर्क", en: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#001a40]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f5e6a8] text-lg font-bold text-[#001a40]">
            M
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide">Sri Magicale</p>
            <p className="text-[11px] text-white/70">Powered by SM Groups</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  active ? "bg-white/10 text-[#d4af37]" : "text-white/85 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <HeaderAuthActions />
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#001530] px-4 py-4 lg:hidden">
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm",
                    active ? "bg-white/10 text-[#d4af37]" : "text-white/90",
                  )}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-2 text-xs text-white/45">{item.en}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-white/10 pt-4 sm:hidden">
            <HeaderAuthActions />
          </div>
        </div>
      ) : null}
    </header>
  );
}
