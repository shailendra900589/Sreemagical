"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowDown, CheckCircle2, GitBranch, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type LookupMember = {
  memberCode: string;
  name: string;
  packageType: "EDU" | "BP" | null;
  isActive: boolean;
  sponsor: { memberCode: string; name: string } | null;
  directDownlines: { memberCode: string; name: string; packageType: "EDU" | "BP" | null }[];
  directCount: number;
};

type Slot = "above" | "insert" | "below";

export function TeamInsertForm() {
  const [codes, setCodes] = useState({ above: "", insert: "", below: "" });
  const [lookups, setLookups] = useState<Record<Slot, LookupMember | null | undefined>>({
    above: undefined,
    insert: undefined,
    below: undefined,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const controllers: AbortController[] = [];

    (["above", "insert", "below"] as Slot[]).forEach((slot) => {
      const code = codes[slot].trim().toUpperCase();
      if (code.length < 3) {
        setLookups((prev) => ({ ...prev, [slot]: undefined }));
        return;
      }
      const ctrl = new AbortController();
      controllers.push(ctrl);
      timers.push(
        setTimeout(async () => {
          try {
            const res = await fetch(`/api/admin/team/lookup?code=${encodeURIComponent(code)}`, {
              signal: ctrl.signal,
            });
            const data = await res.json();
            setLookups((prev) => ({ ...prev, [slot]: data.member ?? null }));
          } catch {
            /* aborted / network */
          }
        }, 280),
      );
    });

    return () => {
      timers.forEach(clearTimeout);
      controllers.forEach((c) => c.abort());
    };
  }, [codes.above, codes.insert, codes.below]);

  const relationOk = useMemo(() => {
    if (!lookups.above || !lookups.below) return null;
    return lookups.below.sponsor?.memberCode === lookups.above.memberCode;
  }, [lookups.above, lookups.below]);

  const clarity = useMemo(() => {
    const a = lookups.above;
    const i = lookups.insert;
    const b = lookups.below;
    if (!a && !i && !b) return null;
    return {
      before: {
        parent: a ? `${a.name} (${a.memberCode})` : codes.above || "Above",
        child: b ? `${b.name} (${b.memberCode})` : codes.below || "Below",
      },
      after: {
        parent: a ? `${a.name} (${a.memberCode})` : codes.above || "Above",
        middle: i ? `${i.name} (${i.memberCode})` : codes.insert || "Insert",
        child: b ? `${b.name} (${b.memberCode})` : codes.below || "Below",
      },
      plainHi: i && a && b
        ? `${i.name} (${i.memberCode}) ko ${a.name} (${a.memberCode}) ke niche rakha ja raha hai, aur ${b.name} (${b.memberCode}) ab ${i.name} ke niche chala jayega.`
        : "Teenon codes bharein — yahan clearly dikhega kis ko kis ke niche rakh rahe ho.",
    };
  }, [lookups, codes]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/team/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aboveMemberCode: codes.above.trim().toUpperCase(),
        insertMemberCode: codes.insert.trim().toUpperCase(),
        belowMemberCode: codes.below.trim().toUpperCase(),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Insert failed");
      return;
    }
    setMessage(
      `Done: ${data.insert} ab ${data.above} ke niche hai, aur ${data.below} ab ${data.insert} ke niche hai.`,
    );
    setCodes({ above: "", insert: "", below: "" });
    setLookups({ above: undefined, insert: undefined, below: undefined });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
          <GitBranch className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#001a40]">Insert member in tree</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Order after insert: <strong>Above → Insert → Below</strong>. Below abhi Above ka direct
            downline hona chahiye.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <CodeField
          label="1 · Above (upar wala / sponsor)"
          hint="Iske niche naya member aayega"
          value={codes.above}
          onChange={(v) => setCodes((c) => ({ ...c, above: v }))}
          member={lookups.above}
          placeholder="e.g. SM000001"
        />
        <CodeField
          label="2 · Insert (beech mein rakha jane wala)"
          hint="Yeh member Above ke niche jayega"
          value={codes.insert}
          onChange={(v) => setCodes((c) => ({ ...c, insert: v }))}
          member={lookups.insert}
          placeholder="Member to place in between"
          accent
        />
        <CodeField
          label="3 · Below (neeche jane wala)"
          hint="Yeh currently Above ka direct child hai — insert ke baad Insert ke niche chala jayega"
          value={codes.below}
          onChange={(v) => setCodes((c) => ({ ...c, below: v }))}
          member={lookups.below}
          placeholder="Current direct downline of above"
        />
      </div>

      {clarity ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-b from-[#fffbeb] to-white p-4 md:p-5">
          <p className="text-sm font-semibold text-[#001a40]">Clarity preview — kis ko kis ke niche?</p>
          <p className="text-sm leading-6 text-slate-700">{clarity.plainHi}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <TreeCard title="Abhi (Before)" tone="muted">
              <NodeCard label="Above" name={clarity.before.parent} />
              <ArrowDown className="mx-auto h-4 w-4 text-slate-300" />
              <NodeCard label="Below (direct)" name={clarity.before.child} />
            </TreeCard>
            <TreeCard title="Insert ke baad (After)" tone="gold">
              <NodeCard label="Above" name={clarity.after.parent} />
              <ArrowDown className="mx-auto h-4 w-4 text-[#9a7b1a]" />
              <NodeCard label="Insert · naya level" name={clarity.after.middle} highlight />
              <ArrowDown className="mx-auto h-4 w-4 text-[#9a7b1a]" />
              <NodeCard label="Below · shift down" name={clarity.after.child} />
            </TreeCard>
          </div>

          {relationOk === false ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              Warning: Below currently Above ka direct downline nahi hai
              {lookups.below?.sponsor
                ? ` (uska sponsor: ${lookups.below.sponsor.memberCode})`
                : ""}
              . Insert tabhi chalega jab Below → Above direct child ho.
            </p>
          ) : null}
          {relationOk === true ? (
            <p className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Relation OK — Below abhi Above ke direct niche hai.
            </p>
          ) : null}
        </div>
      ) : null}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-full bg-[#d4af37] px-6 py-2.5 text-sm font-semibold text-[#001a40] disabled:opacity-60"
      >
        {loading ? "Processing…" : "Insert in team"}
      </button>
    </form>
  );
}

function CodeField({
  label,
  hint,
  value,
  onChange,
  member,
  placeholder,
  accent,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  member: LookupMember | null | undefined;
  placeholder: string;
  accent?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="mt-0.5 block text-[11px] text-slate-400">{hint}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        required
        placeholder={placeholder}
        className={cn(
          "mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/25",
          accent
            ? "border-[#d4af37]/50 bg-[#fffbeb] focus:border-[#d4af37]"
            : "border-slate-200 focus:border-[#d4af37]",
        )}
      />
      {value.trim().length >= 3 ? (
        <MemberChip member={member} />
      ) : null}
    </label>
  );
}

function MemberChip({ member }: { member: LookupMember | null | undefined }) {
  if (member === undefined) {
    return <p className="mt-1.5 text-[11px] text-slate-400">Looking up…</p>;
  }
  if (member === null) {
    return <p className="mt-1.5 text-[11px] text-red-600">Member code not found</p>;
  }
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600">
      <UserRound className="h-3.5 w-3.5 text-[#9a7b1a]" />
      <span className="font-semibold text-[#001a40]">{member.name}</span>
      <span>· {member.packageType ?? "No pkg"}</span>
      <span>· {member.isActive ? "Active" : "Inactive"}</span>
      <span>· Sponsor {member.sponsor?.memberCode ?? "—"}</span>
      <span>· {member.directCount} direct</span>
    </div>
  );
}

function TreeCard({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone: "muted" | "gold";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        tone === "gold" ? "border-[#d4af37]/40 bg-white" : "border-slate-200 bg-slate-50/80",
      )}
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function NodeCard({
  label,
  name,
  highlight,
}: {
  label: string;
  name: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5 text-center",
        highlight
          ? "border-[#d4af37] bg-[#fff8e7] shadow-sm"
          : "border-slate-200 bg-white",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#001a40]">{name}</p>
    </div>
  );
}
