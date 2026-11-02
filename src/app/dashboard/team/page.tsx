import { EmptyState, PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardSummary } from "@/lib/dashboard-stats";
import { getCompensationSettings, levelPercentsFromSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const summary = await getDashboardSummary(user.id);
  const settings = await getCompensationSettings();
  const levels = levelPercentsFromSettings(settings);

  const directTeam = await prisma.user.findMany({
    where: { sponsorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { memberCode: true, name: true, packageType: true, createdAt: true },
  });

  return (
    <div>
      <PageHeader
        titleHi="टीम और लेवल"
        titleEn="My Team & Levels"
        description="Track your downline structure and live level-income schedule from admin settings."
      />

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Team" value={String(summary.team.totalTeam)} />
          <StatCard label="Active Members" value={String(summary.team.activeMembers)} tone="success" />
          <StatCard label="Tree Depth" value={String(summary.team.levelTreeDepth)} />
        </div>

        <Panel title="Level payout schedule" subtitle="Updates instantly when admin changes percentages">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">%</th>
                  <th className="px-4 py-3 font-medium">
                    On {formatINR(settings.bpPackageFee)} BP
                  </th>
                </tr>
              </thead>
              <tbody>
                {levels.map((pct, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-2.5 font-medium text-[#001a40]">Level {i + 1}</td>
                    <td className="px-4 py-2.5 text-[#9a7b1a]">{pct}%</td>
                    <td className="px-4 py-2.5">{formatINR((settings.bpPackageFee * pct) / 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Direct referrals" subtitle="Latest 20 direct joinings">
          {directTeam.length === 0 ? (
            <EmptyState>No direct team yet. Share your referral links to grow.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {directTeam.map((m) => (
                <li key={m.memberCode} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-[#001a40]">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.memberCode}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {m.packageType ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
