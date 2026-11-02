import Link from "next/link";
import { CommissionType } from "@prisma/client";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import {
  AdminLedgerPage,
  AdminMemberCell,
  AdminPanelLink,
  AdminStatGrid,
  AdminSubStatCard,
  AdminSubStatGrid,
  AdminTableShell,
  AdminTd,
  AdminTh,
  AdminThead,
  AdminTr,
} from "@/components/admin/admin-ui";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function AdminCommissionsPage() {
  const [rows, agg, byType] = await Promise.all([
    prisma.commission.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        recipient: { select: { id: true, name: true, memberCode: true } },
        sourceUser: { select: { id: true, name: true, memberCode: true } },
      },
    }),
    prisma.commission.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.commission.groupBy({
      by: ["type"],
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const typeMap = Object.fromEntries(
    byType.map((t) => [t.type, { sum: t._sum.amount ?? 0, count: t._count }]),
  ) as Record<string, { sum: number; count: number }>;

  return (
    <AdminLedgerPage>
      <PageHeader
        titleHi="Commissions"
        titleEn="Complete payout ledger"
        description="Direct referral, level income aur royalty — recipient, source, % aur amount."
      />

      <AdminStatGrid>
        <StatCard label="Ledger entries" value={String(agg._count)} />
        <StatCard label="Total paid" value={formatINR(agg._sum.amount ?? 0)} tone="success" />
        <StatCard
          label="Direct referral"
          value={formatINR(typeMap[CommissionType.DIRECT_REFERRAL]?.sum ?? 0)}
          hint={`${typeMap[CommissionType.DIRECT_REFERRAL]?.count ?? 0} rows`}
        />
        <StatCard
          label="Level income"
          value={formatINR(typeMap[CommissionType.LEVEL_INCOME]?.sum ?? 0)}
          hint={`${typeMap[CommissionType.LEVEL_INCOME]?.count ?? 0} rows`}
          tone="gold"
        />
      </AdminStatGrid>

      <AdminSubStatGrid>
        <AdminSubStatCard
          label="Silver royalty"
          value={formatINR(typeMap.ROYALTY_SILVER?.sum ?? 0)}
          hint={`${typeMap.ROYALTY_SILVER?.count ?? 0} payouts`}
        />
        <AdminSubStatCard
          label="Gold royalty"
          value={formatINR(typeMap.ROYALTY_GOLD?.sum ?? 0)}
          hint={`${typeMap.ROYALTY_GOLD?.count ?? 0} payouts`}
        />
        <AdminSubStatCard
          label="Diamond royalty"
          value={formatINR(typeMap.ROYALTY_DIAMOND?.sum ?? 0)}
          hint={`${typeMap.ROYALTY_DIAMOND?.count ?? 0} payouts`}
        />
      </AdminSubStatGrid>

      <Panel
        className="flex min-h-[28rem] flex-1 flex-col"
        title="Payout ledger"
        subtitle="Latest 100 records"
      >
        {rows.length === 0 ? (
          <p className="flex flex-1 items-center justify-center py-10 text-center text-sm text-slate-500">
            No commission rows yet.
          </p>
        ) : (
          <AdminTableShell>
            <AdminThead>
              <tr>
                <AdminTh className="w-[22%]">Recipient</AdminTh>
                <AdminTh className="w-[5.5rem]">Panel</AdminTh>
                <AdminTh className="w-[16%]">Type</AdminTh>
                <AdminTh className="w-[16%]">Source</AdminTh>
                <AdminTh className="w-[4rem]">%</AdminTh>
                <AdminTh className="w-[7rem]">Amount</AdminTh>
                <AdminTh className="w-[10rem]">Date</AdminTh>
              </tr>
            </AdminThead>
            <tbody>
              {rows.map((r) => (
                <AdminTr key={r.id}>
                  <AdminTd>
                    <AdminMemberCell
                      memberId={r.recipient.id}
                      name={r.recipient.name}
                      memberCode={r.recipient.memberCode}
                    />
                  </AdminTd>
                  <AdminTd>
                    <AdminPanelLink memberId={r.recipient.id} />
                  </AdminTd>
                  <AdminTd className="text-xs text-slate-600">
                    <span className="block truncate font-medium text-[#001a40]">
                      {r.type.replaceAll("_", " ")}
                      {r.level ? ` · L${r.level}` : ""}
                    </span>
                    {r.description ? (
                      <span className="mt-0.5 block truncate text-slate-400">{r.description}</span>
                    ) : null}
                  </AdminTd>
                  <AdminTd className="text-xs text-slate-600">
                    {r.sourceUser ? (
                      <Link
                        href={`/admin/members/${r.sourceUser.id}`}
                        className="font-medium hover:underline"
                      >
                        <span className="block truncate">{r.sourceUser.name}</span>
                        <span className="block truncate text-slate-400">
                          {r.sourceUser.memberCode}
                        </span>
                      </Link>
                    ) : (
                      "—"
                    )}
                  </AdminTd>
                  <AdminTd>{r.percentApplied}%</AdminTd>
                  <AdminTd className="font-semibold text-emerald-700">
                    +{formatINR(r.amount)}
                  </AdminTd>
                  <AdminTd className="whitespace-nowrap text-xs text-slate-500">
                    {r.createdAt.toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTableShell>
        )}
      </Panel>
    </AdminLedgerPage>
  );
}
