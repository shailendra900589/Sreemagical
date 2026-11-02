"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, FileText, LayoutDashboard } from "lucide-react";
import { memberPanelHref } from "@/lib/admin-member-links";

type Props = {
  memberId: string;
  memberCode: string;
  memberName: string;
  compact?: boolean;
};

export function MemberRowActions({ memberId, memberCode, memberName, compact }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(memberCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const panelHref = memberPanelHref(memberId);
  const detailHref = `/admin/members/${memberId}`;

  return (
    <div className={`flex shrink-0 flex-wrap items-center gap-1.5 ${compact ? "" : ""}`}>
      <a
        href={panelHref}
        className="sm-press inline-flex items-center gap-1.5 rounded-full bg-[#001a40] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#002b5c]"
        title={`Open ${memberName}'s live panel`}
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        {compact ? "Panel" : "Member panel"}
      </a>
      <Link
        href={detailHref}
        className="sm-press inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#001a40] hover:bg-slate-50"
        title="Full member dossier"
      >
        <FileText className="h-3.5 w-3.5" />
        Detail
      </Link>
      <button
        type="button"
        onClick={copyCode}
        className="sm-press inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#001a40] hover:bg-slate-50"
        title={`Copy ${memberCode}`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Code
          </>
        )}
      </button>
    </div>
  );
}
