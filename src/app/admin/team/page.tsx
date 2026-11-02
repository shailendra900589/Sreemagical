import Link from "next/link";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { TeamTreeWorkspace } from "@/components/admin/TeamTreeWorkspace";
import { prisma } from "@/lib/prisma";
import { memberPanelHref } from "@/lib/admin-member-links";

export default async function AdminTeamPage() {
  const [treeMembers, sample, totalMembers, withSponsor, roots] = await Promise.all([
    prisma.user.findMany({
      where: { role: "MEMBER" },
      select: {
        id: true,
        memberCode: true,
        name: true,
        packageType: true,
        isActive: true,
        sponsorId: true,
      },
      orderBy: { memberCode: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "MEMBER" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        memberCode: true,
        name: true,
        packageType: true,
        sponsor: { select: { memberCode: true, name: true } },
        _count: { select: { downlines: true } },
      },
    }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "MEMBER", sponsorId: { not: null } } }),
    prisma.user.count({ where: { role: "MEMBER", sponsorId: null } }),
  ]);

  return (
    <div>
      <PageHeader
        titleHi="Team structure"
        titleEn="Insert member between levels"
        description="Visual tree: drag-and-drop se dekho kiski leg ke niche kaun hai. Beech mein insert ya direct sponsor move — dono modes."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Members" value={String(totalMembers)} />
        <StatCard label="With sponsor" value={String(withSponsor)} />
        <StatCard label="Root / no sponsor" value={String(roots)} tone="gold" />
      </div>

      <TeamTreeWorkspace members={treeMembers} />

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <Panel title="Quick guide" subtitle="Insert vs move">
            <ol className="list-decimal space-y-2 pl-4 text-sm leading-6 text-slate-700">
              <li>
                <strong>Insert between</strong> — dashed zone par drop: Above → Insert → Below (leg
                shift).
              </li>
              <li>
                <strong>New leg / move</strong> — member ko node par drop: direct sponsor set (no
                shift).
              </li>
              <li>Left list se click = Insert slot; node par Above / Insert / Below buttons bhi hain.</li>
            </ol>
          </Panel>

          <Panel title="Recent member codes" subtitle="Dossier · panel">
            <ul className="divide-y divide-slate-100 text-sm">
              {sample.length === 0 && (
                <li className="py-3 text-slate-500">No members yet.</li>
              )}
              {sample.map((m) => (
                <li key={m.memberCode} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="font-medium text-[#001a40] hover:underline"
                    >
                      {m.name}
                    </Link>
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-600">{m.memberCode}</span>
                      {m.sponsor ? ` · under ${m.sponsor.memberCode}` : " · root"}
                      {" · "}
                      {m._count.downlines} direct
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold">
                      {m.packageType ?? "—"}
                    </span>
                    <a
                      href={memberPanelHref(m.id)}
                      className="sm-press rounded-full bg-[#001a40] px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Panel
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
      </div>
    </div>
  );
}
