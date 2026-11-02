import { PackageType } from "@prisma/client";
import { Panel } from "@/components/dashboard/ui";
import {
  AdminKpiCard,
  AdminMetricsSection,
  AdminModuleGrid,
  AdminOverviewHero,
  AdminRecentCommissions,
  AdminRecentMembers,
  AdminViewAllLink,
  GraduationCap,
} from "@/components/admin/AdminOverviewUI";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { getCompensationSettings } from "@/lib/settings";
import { Banknote, Percent, TrendingUp, Users, Wallet } from "lucide-react";

export default async function AdminHomePage() {
  const [
    totalMembers,
    bpCount,
    eduCount,
    activeCount,
    enrollAgg,
    commissionAgg,
    settings,
    recentMembers,
    recentCommissions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { packageType: PackageType.BP } }),
    prisma.user.count({ where: { packageType: PackageType.EDU } }),
    prisma.user.count({ where: { isActive: true, role: "MEMBER" } }),
    prisma.enrollment.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.commission.aggregate({ _sum: { amount: true }, _count: true }),
    getCompensationSettings(),
    prisma.user.findMany({
      where: { role: "MEMBER" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        memberCode: true,
        name: true,
        packageType: true,
        createdAt: true,
        sponsor: { select: { memberCode: true } },
      },
    }),
    prisma.commission.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { recipient: { select: { name: true, memberCode: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminOverviewHero
        activeMembers={activeCount}
        totalMembers={totalMembers}
        turnoverLabel={formatINR(enrollAgg._sum.amount ?? 0)}
        offerActive={settings.offerActive}
        offerPct={settings.directReferralOfferPct}
      />

      <div className="space-y-4">
        <AdminMetricsSection
          title="Network & revenue"
          subtitle="Members, packages aur joining turnover"
          columns={4}
        >
          <AdminKpiCard
            label="Members"
            value={String(totalMembers)}
            hint={`${activeCount} active now`}
            icon={Users}
            tone="navy"
          />
          <AdminKpiCard
            label="BP packages"
            value={String(bpCount)}
            hint="Business purpose"
            icon={TrendingUp}
            tone="gold"
          />
          <AdminKpiCard
            label="Edu packages"
            value={String(eduCount)}
            hint="Learning only"
            icon={GraduationCap}
            tone="sky"
          />
          <AdminKpiCard
            label="Total turnover"
            value={formatINR(enrollAgg._sum.amount ?? 0)}
            hint={`${enrollAgg._count} enrollments`}
            icon={Wallet}
            tone="emerald"
          />
        </AdminMetricsSection>

        <AdminMetricsSection
          title="Payouts & rates"
          subtitle="Commissions, sponsor % aur package fees"
          columns={3}
        >
          <AdminKpiCard
            label="Commissions paid"
            value={formatINR(commissionAgg._sum.amount ?? 0)}
            hint={`${commissionAgg._count} ledger rows`}
            icon={Wallet}
            tone="emerald"
          />
          <AdminKpiCard
            label="Direct sponsor"
            value={`${settings.directReferralStandardPct}%`}
            hint={
              settings.offerActive
                ? `Offer ON · ${settings.directReferralOfferPct}% live`
                : `Offer OFF · ${settings.directReferralOfferPct}% ready`
            }
            icon={Percent}
            tone="gold"
          />
          <AdminKpiCard
            label="Package fees"
            value={formatINR(settings.bpPackageFee)}
            hint={`Edu ${formatINR(settings.eduPackageFee)} · BP listed`}
            icon={Banknote}
            tone="navy"
          />
        </AdminMetricsSection>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Recent members"
          subtitle="Latest joinings in your network"
          action={<AdminViewAllLink href="/admin/members">View all</AdminViewAllLink>}
        >
          <AdminRecentMembers members={recentMembers} />
        </Panel>

        <Panel
          title="Recent commissions"
          subtitle="Latest payout activity"
          action={<AdminViewAllLink href="/admin/commissions">View all</AdminViewAllLink>}
        >
          <AdminRecentCommissions rows={recentCommissions} />
        </Panel>
      </div>

      <Panel title="Quick access" subtitle="Jump to any admin module">
        <AdminModuleGrid />
      </Panel>
    </div>
  );
}
