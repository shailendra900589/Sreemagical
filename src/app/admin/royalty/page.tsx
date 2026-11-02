import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { RoyaltyDistributeForm } from "@/components/admin/RoyaltyDistributeForm";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { getCompensationSettings } from "@/lib/settings";

export default async function AdminRoyaltyPage() {
  const [settings, cycles, clubs] = await Promise.all([
    getCompensationSettings(),
    prisma.royaltyCycle.findMany({ orderBy: { distributedAt: "desc" }, take: 12 }),
    prisma.user.groupBy({
      by: ["clubTier"],
      _count: true,
      where: { role: "MEMBER" },
    }),
  ]);

  const clubMap = Object.fromEntries(clubs.map((c) => [c.clubTier, c._count]));

  return (
    <div>
      <PageHeader
        titleHi="Royalty cycle"
        titleEn="Club pool distribution"
        description="Company turnover ka royalty pool Silver / Gold / Diamond members mein baantein."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total royalty %" value={`${settings.royaltyTotalPct}%`} />
        <StatCard label="Silver members" value={String(clubMap.SILVER ?? 0)} hint={`${settings.silverPoolPct}% pool`} />
        <StatCard label="Gold members" value={String(clubMap.GOLD ?? 0)} hint={`${settings.goldPoolPct}% pool`} tone="gold" />
        <StatCard label="Diamond members" value={String(clubMap.DIAMOND ?? 0)} hint={`${settings.diamondPoolPct}% pool`} />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        {[
          {
            tier: "Silver",
            pool: settings.silverPoolPct,
            direct: settings.silverMinDirectBp,
            team: settings.silverMinTeamBp,
            count: clubMap.SILVER ?? 0,
          },
          {
            tier: "Gold",
            pool: settings.goldPoolPct,
            direct: settings.goldMinDirectBp,
            team: settings.goldMinTeamBp,
            count: clubMap.GOLD ?? 0,
          },
          {
            tier: "Diamond",
            pool: settings.diamondPoolPct,
            direct: settings.diamondMinDirectBp,
            team: settings.diamondMinTeamBp,
            count: clubMap.DIAMOND ?? 0,
          },
        ].map((c) => (
          <div key={c.tier} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9a7b1a]">{c.tier}</p>
            <p className="mt-1 text-2xl font-semibold text-[#001a40]">{c.count} members</p>
            <p className="mt-2 text-sm text-slate-600">Pool share {c.pool}% of turnover</p>
            <p className="mt-1 text-xs text-slate-400">
              Qualify: ≥{c.direct} direct BP · ≥{c.team} team BP
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Run distribution" subtitle="Credits wallets of club-qualified BP members">
          <RoyaltyDistributeForm />
        </Panel>
        <Panel title="Past cycles" subtitle="Distribution history with turnover base">
          <ul className="divide-y divide-slate-100 text-sm">
            {cycles.length === 0 && (
              <li className="py-4 text-slate-500">No royalty cycles yet.</li>
            )}
            {cycles.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-[#001a40]">{c.periodLabel}</p>
                  <p className="text-xs text-slate-400">
                    {c.distributedAt.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="font-semibold">{formatINR(c.totalTurnover)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
