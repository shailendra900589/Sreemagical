import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { countTeamStats } from "@/lib/team";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { memberPanelHref } from "@/lib/admin-member-links";

type Props = { params: Promise<{ id: string }> };

export default async function AdminMemberDetailPage({ params }: Props) {
  const { id } = await params;
  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      sponsor: { select: { id: true, memberCode: true, name: true, packageType: true } },
      downlines: {
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          memberCode: true,
          name: true,
          packageType: true,
          isActive: true,
          createdAt: true,
        },
      },
      enrollments: { orderBy: { createdAt: "desc" }, take: 20 },
      commissionsEarned: {
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { sourceUser: { select: { name: true, memberCode: true } } },
      },
      courseProgress: {
        include: { course: { select: { titleEn: true, titleHi: true, slug: true } } },
      },
    },
  });

  if (!member) notFound();

  const team = await countTeamStats(member.id);
  const commissionSum = member.commissionsEarned.reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <Link
        href="/admin/members"
        className="sm-press mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#001a40]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to members
      </Link>

      <PageHeader
        titleHi={member.name}
        titleEn={`${member.memberCode} · Member dossier`}
        description={`${member.email}${member.phone ? ` · ${member.phone}` : ""} · Role ${member.role}`}
        action={
          member.role !== "ADMIN" ? (
            <a
              href={memberPanelHref(member.id)}
              className="sm-press inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#001a40] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#002b5c] sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open member panel
            </a>
          ) : null
        }
      />

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Package" value={member.packageType ?? "—"} tone="gold" />
          <StatCard label="Wallet" value={formatINR(member.walletBalance)} tone="success" />
          <StatCard
            label="Team size"
            value={String(team.totalTeam)}
            hint={`${team.directReferrals} direct · depth ${team.levelTreeDepth}`}
          />
          <StatCard
            label="Status"
            value={member.isActive ? "Active" : "Inactive"}
            hint={`Club ${member.clubTier}`}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Upline / sponsor" subtitle="Placement in tree">
            {member.sponsor ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-[#001a40]">{member.sponsor.name}</p>
                <p className="text-xs text-slate-500">
                  {member.sponsor.memberCode} · {member.sponsor.packageType ?? "—"}
                </p>
                <Link
                  href={`/admin/members/${member.sponsor.id}`}
                  className="mt-2 inline-block text-xs font-semibold text-[#001a40] underline"
                >
                  Open sponsor detail
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No sponsor (root / company line).</p>
            )}
            <p className="mt-3 text-xs text-slate-400">
              Joined {member.createdAt.toLocaleString("en-IN")} · Leg {member.placementLeg}
            </p>
          </Panel>

          <Panel title="Earnings snapshot" subtitle="From commission ledger">
            <p className="text-2xl font-semibold text-emerald-700">+{formatINR(commissionSum)}</p>
            <p className="mt-1 text-xs text-slate-500">
              Showing latest {member.commissionsEarned.length} entries on this page
            </p>
          </Panel>
        </div>

        <Panel title="Direct downlines" subtitle={`${member.downlines.length} shown`}>
          {member.downlines.length === 0 ? (
            <p className="text-sm text-slate-500">No direct downlines yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {member.downlines.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/members/${d.id}`}
                      className="font-medium text-[#001a40] hover:underline"
                    >
                      {d.name}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {d.memberCode} · {d.createdAt.toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold">
                      {d.packageType ?? "—"}
                    </span>
                    <a
                      href={memberPanelHref(d.id)}
                      className="sm-press rounded-full bg-[#001a40] px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Panel
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Enrollments" subtitle="Package fees paid">
            {member.enrollments.length === 0 ? (
              <p className="text-sm text-slate-500">No enrollments.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {member.enrollments.map((e) => (
                  <li key={e.id} className="flex justify-between py-2.5">
                    <div>
                      <p className="font-medium">{e.packageType}</p>
                      <p className="text-xs text-slate-400">
                        {e.status} · {e.createdAt.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="font-semibold">{formatINR(e.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Course progress">
            {member.courseProgress.length === 0 ? (
              <p className="text-sm text-slate-500">No course progress yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {member.courseProgress.map((p) => (
                  <li key={p.id} className="flex justify-between py-2.5">
                    <span>{p.course.titleHi}</span>
                    <span className="font-semibold text-[#9a7b1a]">{p.percent}%</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Commission ledger" subtitle="Latest payouts to this member">
          {member.commissionsEarned.length === 0 ? (
            <p className="text-sm text-slate-500">No commissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Source</th>
                    <th className="px-3 py-2">%</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {member.commissionsEarned.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100">
                      <td className="px-3 py-2">
                        {c.type.replaceAll("_", " ")}
                        {c.level ? ` · L${c.level}` : ""}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {c.sourceUser
                          ? `${c.sourceUser.name} (${c.sourceUser.memberCode})`
                          : "—"}
                      </td>
                      <td className="px-3 py-2">{c.percentApplied}%</td>
                      <td className="px-3 py-2 font-semibold text-emerald-700">
                        +{formatINR(c.amount)}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-400">
                        {c.createdAt.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
