import { Award, Gem, Medal } from "lucide-react";
import { EmptyState, PageHeader, Panel } from "@/components/dashboard/ui";
import { getCurrentUser } from "@/lib/auth";
import { getCompensationSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { cn, formatINR } from "@/lib/utils";

const tierMeta = {
  SILVER: { label: "Silver Club", icon: Medal, accent: "from-slate-200 to-slate-50", ring: "ring-slate-300" },
  GOLD: { label: "Gold Club", icon: Award, accent: "from-amber-200 to-amber-50", ring: "ring-amber-300" },
  DIAMOND: { label: "Diamond Club", icon: Gem, accent: "from-sky-200 to-sky-50", ring: "ring-sky-300" },
  NONE: { label: "Not qualified", icon: Medal, accent: "from-slate-100 to-white", ring: "ring-slate-200" },
} as const;

export default async function RoyaltyPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const settings = await getCompensationSettings();
  const cycles = await prisma.royaltyCycle.findMany({
    orderBy: { distributedAt: "desc" },
    take: 6,
  });

  const clubs = [
    {
      key: "SILVER" as const,
      name: "Silver Club",
      nameHi: "सिल्वर क्लब",
      pool: settings.silverPoolPct,
      direct: settings.silverMinDirectBp,
      team: settings.silverMinTeamBp,
      icon: Medal,
    },
    {
      key: "GOLD" as const,
      name: "Gold Club",
      nameHi: "गोल्ड क्लब",
      pool: settings.goldPoolPct,
      direct: settings.goldMinDirectBp,
      team: settings.goldMinTeamBp,
      icon: Award,
    },
    {
      key: "DIAMOND" as const,
      name: "Diamond Club",
      nameHi: "डायमंड क्लब",
      pool: settings.diamondPoolPct,
      direct: settings.diamondMinDirectBp,
      team: settings.diamondMinTeamBp,
      icon: Gem,
    },
  ];

  const current = tierMeta[user.clubTier] ?? tierMeta.NONE;
  const CurrentIcon = current.icon;

  return (
    <div>
      <PageHeader
        titleHi="रॉयल्टी क्लब"
        titleEn="Royalty Club"
        description={`${settings.royaltyTotalPct}% of company turnover is distributed each cycle among qualified club members.`}
      />

      <div className="space-y-5">
        <Panel>
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1",
                current.accent,
                current.ring,
              )}
            >
              <CurrentIcon className="h-6 w-6 text-[#001a40]" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Your current tier</p>
              <p className="text-xl font-semibold text-[#001a40]">{current.label}</p>
              <p className="text-sm text-slate-500">
                Pool share is split equally among all members in the same tier.
              </p>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-3">
          {clubs.map((club) => {
            const Icon = club.icon;
            const active = user.clubTier === club.key;
            return (
              <div
                key={club.key}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm",
                  active ? "border-[#d4af37] ring-2 ring-[#d4af37]/25" : "border-slate-200/80",
                )}
              >
                {active ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#001a40] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]">
                    Active
                  </span>
                ) : null}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs text-slate-400">{club.name}</p>
                <h3 className="text-lg font-semibold text-[#001a40]">{club.nameHi}</h3>
                <p className="mt-2 text-2xl font-semibold text-[#9a7b1a]">{club.pool}%</p>
                <p className="text-xs text-slate-500">of total company turnover</p>
                <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Direct BP:</span> {club.direct}+
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Team BP volume:</span> {club.team}+
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Panel title="Past royalty cycles" subtitle="Monthly distribution history">
          {cycles.length === 0 ? (
            <EmptyState>
              No cycles distributed yet. Admin can run the monthly royalty job when ready.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {cycles.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium text-[#001a40]">{c.periodLabel}</span>
                  <span className="text-slate-500">Turnover {formatINR(c.totalTurnover)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
