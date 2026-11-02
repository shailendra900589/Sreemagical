"use client";

import { LogOut, Shield } from "lucide-react";

export function ImpersonationBanner({
  memberName,
  memberCode,
}: {
  memberName: string;
  memberCode: string;
}) {
  return (
    <div className="sticky top-0 z-50 border-b border-amber-300/80 bg-gradient-to-r from-amber-100 via-amber-50 to-white px-3 py-2.5 shadow-sm sm:px-4">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2 sm:items-center">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-800 sm:mt-0" />
          <p className="text-xs text-amber-950 sm:text-sm">
            <span className="font-semibold">Admin preview</span>
            <span className="hidden sm:inline"> — </span>
            <span className="block sm:inline">
              You are viewing the exact member panel as{" "}
              <strong>
                {memberName} ({memberCode})
              </strong>
              .
            </span>
          </p>
        </div>
        <form action="/api/admin/impersonate/exit" method="post" className="shrink-0">
          <button
            type="submit"
            className="sm-press inline-flex items-center gap-1.5 rounded-full bg-[#001a40] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#002b5c]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit to admin
          </button>
        </form>
      </div>
    </div>
  );
}
