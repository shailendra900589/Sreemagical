"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Me = { name: string; role: string } | null;

export function HeaderAuthActions() {
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  if (user) {
    return (
      <Link
        href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
        className="rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#001a40]"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm md:inline-block">
        Login
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#001a40]"
      >
        जॉइन करें
      </Link>
    </div>
  );
}
