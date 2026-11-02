"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GitBranch,
  GripVertical,
  Hand,
  Search,
} from "lucide-react";
import { buildMemberForest, type TeamTreeMember, type TeamTreeNode } from "@/lib/team-tree";
import { cn } from "@/lib/utils";

type LookupMember = {
  memberCode: string;
  name: string;
  packageType: "EDU" | "BP" | null;
  isActive: boolean;
  sponsor: { memberCode: string; name: string } | null;
  directCount: number;
};

type Slot = "above" | "insert" | "below";
type ActionMode = "insert" | "reparent";

type Props = {
  members: TeamTreeMember[];
};

export function TeamTreeWorkspace({ members }: Props) {
  const router = useRouter();
  const { roots, byId } = useMemo(() => buildMemberForest(members), [members]);

  const [mode, setMode] = useState<ActionMode>("insert");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(roots.map((r) => r.id)));
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [dragMemberId, setDragMemberId] = useState<string | null>(null);

  const [codes, setCodes] = useState({ above: "", insert: "", below: "" });
  const [reparentCodes, setReparentCodes] = useState({ member: "", sponsor: "" });
  const [lookups, setLookups] = useState<Record<Slot, LookupMember | null | undefined>>({
    above: undefined,
    insert: undefined,
    below: undefined,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const picked = pickedId ? byId.get(pickedId) : null;
  const dragMember = dragMemberId ? byId.get(dragMemberId) : null;

  const filteredPalette = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...members].sort((a, b) => a.memberCode.localeCompare(b.memberCode));
    if (!q) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.memberCode.toLowerCase().includes(q),
    );
  }, [members, search]);

  const applyMemberCode = useCallback((slot: Slot, code: string) => {
    setCodes((c) => ({ ...c, [slot]: code.toUpperCase() }));
  }, []);

  const applyInsertBetween = useCallback(
    (above: TeamTreeNode, insert: TeamTreeNode, below: TeamTreeNode) => {
      setMode("insert");
      setCodes({
        above: above.memberCode,
        insert: insert.memberCode,
        below: below.memberCode,
      });
      setMessage(null);
      setError(null);
    },
    [],
  );

  const applyReparent = useCallback((member: TeamTreeNode, sponsor: TeamTreeNode) => {
    setMode("reparent");
    setReparentCodes({ member: member.memberCode, sponsor: sponsor.memberCode });
    setMessage(null);
    setError(null);
  }, []);

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
            /* aborted */
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

  async function onInsertSubmit(e: FormEvent) {
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
    router.refresh();
  }

  async function onReparentSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/team/reparent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberMemberCode: reparentCodes.member.trim().toUpperCase(),
        sponsorMemberCode: reparentCodes.sponsor.trim().toUpperCase(),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Move failed");
      return;
    }
    setMessage(`${data.member} ab ${data.sponsor} ke direct leg ke niche hai.`);
    setReparentCodes({ member: "", sponsor: "" });
    router.refresh();
  }

  function resolveDragMember(): TeamTreeNode | null {
    if (dragMember) return dragMember;
    if (picked) return picked;
    return null;
  }

  function onDropOnEdge(above: TeamTreeNode, below: TeamTreeNode) {
    const insert = resolveDragMember();
    if (!insert) {
      setError("Pehle left list se member pick karo ya drag karo.");
      return;
    }
    if (insert.id === above.id || insert.id === below.id) {
      setError("Insert member alag hona chahiye.");
      return;
    }
    applyInsertBetween(above, insert, below);
  }

  function onDropOnSponsor(sponsor: TeamTreeNode) {
    const member = resolveDragMember();
    if (!member) {
      setError("Pehle member select karo.");
      return;
    }
    if (member.id === sponsor.id) {
      setError("Same member ko sponsor nahi bana sakte.");
      return;
    }
    applyReparent(member, sponsor);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#001a40]">Visual team tree</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                <strong>Leg</strong> = kisi ke direct niche wale member. Member ko list se{" "}
                <strong>drag</strong> karke leg ke beech drop karo (insert), ya kisi node par drop
                karo (direct sponsor). Click se bhi slot assign ho sakta hai.
              </p>
            </div>
          </div>
          <div className="flex rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("insert")}
              className={cn(
                "rounded-full px-3 py-1.5 transition",
                mode === "insert" ? "bg-[#001a40] text-white" : "text-slate-600",
              )}
            >
              Insert between
            </button>
            <button
              type="button"
              onClick={() => setMode("reparent")}
              className={cn(
                "rounded-full px-3 py-1.5 transition",
                mode === "reparent" ? "bg-[#001a40] text-white" : "text-slate-600",
              )}
            >
              New leg / move
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,240px)_1fr]">
          <aside className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Members — drag or click
            </p>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code / name"
                className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-2 text-xs outline-none focus:border-[#d4af37]"
              />
            </div>
            <ul className="mt-2 max-h-[420px] space-y-1 overflow-y-auto pr-0.5">
              {filteredPalette.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    draggable
                    onDragStart={() => setDragMemberId(m.id)}
                    onDragEnd={() => setDragMemberId(null)}
                    onClick={() => {
                      setPickedId(m.id);
                      if (mode === "reparent") {
                        setReparentCodes((r) => ({ ...r, member: m.memberCode }));
                      } else {
                        applyMemberCode("insert", m.memberCode);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs transition",
                      pickedId === m.id || dragMemberId === m.id
                        ? "border-[#d4af37] bg-[#fff8e7]"
                        : "border-transparent bg-white hover:border-slate-200",
                    )}
                  >
                    <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-[#001a40]">{m.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {m.memberCode} · {m.packageType ?? "—"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {picked ? (
              <p className="mt-2 rounded-lg bg-[#001a40]/5 px-2 py-1.5 text-[10px] text-slate-600">
                Selected: <strong>{picked.memberCode}</strong>
              </p>
            ) : (
              <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                <Hand className="h-3 w-3" /> Click = insert slot · Drag = drop on tree
              </p>
            )}
          </aside>

          <div className="min-h-[200px] overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
            {roots.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No members in tree yet.</p>
            ) : (
              <ul className="space-y-1">
                {roots.map((node) => (
                  <TreeBranch
                    key={node.id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    onToggle={toggleExpand}
                    pickedId={pickedId}
                    onPick={setPickedId}
                    onAssignSlot={(slot, n) => applyMemberCode(slot, n.memberCode)}
                    onDropEdge={onDropOnEdge}
                    onDropSponsor={onDropOnSponsor}
                    highlightCode={search.trim().toUpperCase()}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {mode === "insert" ? (
        <form
          onSubmit={onInsertSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold text-[#001a40]">Confirm insert (tree se auto-fill)</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <MiniCode label="Above" value={codes.above} onChange={(v) => applyMemberCode("above", v)} />
            <MiniCode
              label="Insert"
              value={codes.insert}
              onChange={(v) => applyMemberCode("insert", v)}
              accent
            />
            <MiniCode label="Below (leg)" value={codes.below} onChange={(v) => applyMemberCode("below", v)} />
          </div>

          {relationOk === false ? (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              Below, Above ka direct leg nahi hai — tree par sahi edge par drop karo.
            </p>
          ) : null}
          {relationOk === true ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> Leg relation OK
            </p>
          ) : null}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {message && (
            <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-[#d4af37] px-6 py-2.5 text-sm font-semibold text-[#001a40] disabled:opacity-60"
          >
            {loading ? "Processing…" : "Insert in team"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={onReparentSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold text-[#001a40]">Move member — kiske leg ke niche?</p>
          <p className="mt-1 text-xs text-slate-500">
            Member ko kisi sponsor ke direct niche rakho (beech mein kisi ko shift nahi karta).
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MiniCode
              label="Member (jo move hoga)"
              value={reparentCodes.member}
              onChange={(v) => setReparentCodes((r) => ({ ...r, member: v.toUpperCase() }))}
              accent
            />
            <MiniCode
              label="Sponsor (kis ke niche)"
              value={reparentCodes.sponsor}
              onChange={(v) => setReparentCodes((r) => ({ ...r, sponsor: v.toUpperCase() }))}
            />
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {message && (
            <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-[#001a40] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Saving…" : "Place under sponsor"}
          </button>
        </form>
      )}
    </div>
  );
}

function TreeBranch({
  node,
  depth,
  expanded,
  onToggle,
  pickedId,
  onPick,
  onAssignSlot,
  onDropEdge,
  onDropSponsor,
  highlightCode,
}: {
  node: TeamTreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  pickedId: string | null;
  onPick: (id: string) => void;
  onAssignSlot: (slot: Slot, node: TeamTreeNode) => void;
  onDropEdge: (above: TeamTreeNode, below: TeamTreeNode) => void;
  onDropSponsor: (sponsor: TeamTreeNode) => void;
  highlightCode: string;
}) {
  const isOpen = expanded.has(node.id);
  const hasKids = node.children.length > 0;
  const highlighted =
    highlightCode.length >= 2 &&
    (node.memberCode.includes(highlightCode) || node.name.toUpperCase().includes(highlightCode));

  return (
    <li className="list-none">
      <div
        className="flex items-stretch gap-1"
        style={{ paddingLeft: depth * 14 }}
      >
        {hasKids ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}

        <div
          className={cn(
            "group my-1 min-w-[200px] flex-1 rounded-xl border px-3 py-2 transition",
            highlighted ? "border-[#d4af37] bg-[#fffbeb]" : "border-slate-200 bg-slate-50/50",
            pickedId === node.id && "ring-2 ring-[#001a40]/20",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDropSponsor(node);
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => onPick(node.id)} className="min-w-0 text-left">
              <p className="text-sm font-semibold text-[#001a40]">{node.name}</p>
              <p className="text-[11px] text-slate-500">
                {node.memberCode} · {node.packageType ?? "—"} ·{" "}
                <span className="font-medium text-[#9a7b1a]">{node.directCount} leg(s)</span>
              </p>
            </button>
            <div className="flex flex-wrap gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100">
              <SlotBtn label="Above" onClick={() => onAssignSlot("above", node)} />
              <SlotBtn label="Insert" onClick={() => onAssignSlot("insert", node)} accent />
              <SlotBtn label="Below" onClick={() => onAssignSlot("below", node)} />
            </div>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Drop member here = iske direct leg ke niche</p>
        </div>
      </div>

      {isOpen && hasKids ? (
        <ul className="space-y-0">
          {node.children.map((child) => (
            <li key={child.id} className="list-none">
              <EdgeDropZone
                above={node}
                below={child}
                depth={depth + 1}
                onDrop={() => onDropEdge(node, child)}
              />
              <TreeBranch
                node={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
                pickedId={pickedId}
                onPick={onPick}
                onAssignSlot={onAssignSlot}
                onDropEdge={onDropEdge}
                onDropSponsor={onDropSponsor}
                highlightCode={highlightCode}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function EdgeDropZone({
  above,
  below,
  depth,
  onDrop,
}: {
  above: TeamTreeNode;
  below: TeamTreeNode;
  depth: number;
  onDrop: () => void;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      style={{ paddingLeft: depth * 14 + 28 }}
      className="py-0.5"
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onDrop();
      }}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-dashed px-2 py-1.5 text-[10px] transition",
          over
            ? "border-[#d4af37] bg-[#fff8e7] text-[#9a7b1a]"
            : "border-slate-200 text-slate-400 hover:border-[#d4af37]/50",
        )}
      >
        <ArrowDown className="h-3 w-3 shrink-0" />
        <span>
          Insert between <strong>{above.memberCode}</strong> → <strong>{below.memberCode}</strong>
        </span>
      </div>
    </div>
  );
}

function SlotBtn({
  label,
  onClick,
  accent,
}: {
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        accent ? "bg-[#d4af37]/30 text-[#7a5f00]" : "bg-white text-slate-500 ring-1 ring-slate-200",
      )}
    >
      {label}
    </button>
  );
}

function MiniCode({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accent?: boolean;
}) {
  return (
    <label className="block text-xs">
      <span className="font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className={cn(
          "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]/25",
          accent ? "border-[#d4af37]/50 bg-[#fffbeb]" : "border-slate-200",
        )}
      />
    </label>
  );
}
