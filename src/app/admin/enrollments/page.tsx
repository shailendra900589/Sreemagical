import { PackageType, UserRole } from "@prisma/client";
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
  LedgerStatusBadge,
  PackageBadge,
} from "@/components/admin/admin-ui";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function AdminEnrollmentsPage() {
  const memberWhere = { user: { role: UserRole.MEMBER } };

  const [rows, agg, eduAgg, bpAgg, completed, pending, failed] = await Promise.all([
    prisma.enrollment.findMany({
      where: memberWhere,
      orderBy: { createdAt: "desc" },
      take: 80,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            memberCode: true,
            email: true,
            sponsor: { select: { memberCode: true, name: true } },
          },
        },
      },
    }),
    prisma.enrollment.aggregate({ where: memberWhere, _sum: { amount: true }, _count: true }),
    prisma.enrollment.aggregate({
      where: { ...memberWhere, packageType: PackageType.EDU },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.enrollment.aggregate({
      where: { ...memberWhere, packageType: PackageType.BP },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.enrollment.count({ where: { ...memberWhere, status: "COMPLETED" } }),
    prisma.enrollment.count({ where: { ...memberWhere, status: "PENDING" } }),
    prisma.enrollment.count({ where: { ...memberWhere, status: "FAILED" } }),
  ]);

  return (
    <AdminLedgerPage>
      <PageHeader
        titleHi="Enrollments"
        titleEn="Package joinings & fee collection"
        description="Member joinings only — package, amount, sponsor, status. Panel opens live member dashboard."
      />

      <AdminStatGrid>
        <StatCard label="Total enrollments" value={String(agg._count)} />
        <StatCard label="Turnover" value={formatINR(agg._sum.amount ?? 0)} tone="success" />
        <StatCard
          label="Edu joinings"
          value={String(eduAgg._count)}
          hint={formatINR(eduAgg._sum.amount ?? 0)}
        />
        <StatCard
          label="BP joinings"
          value={String(bpAgg._count)}
          hint={formatINR(bpAgg._sum.amount ?? 0)}
          tone="gold"
        />
      </AdminStatGrid>

      <AdminSubStatGrid>
        <AdminSubStatCard label="Completed" value={String(completed)} hint="Successful fees" />
        <AdminSubStatCard label="Pending" value={String(pending)} hint="Awaiting confirmation" />
        <AdminSubStatCard label="Failed" value={String(failed)} hint="Needs follow-up" />
      </AdminSubStatGrid>

      <Panel
        className="flex min-h-[28rem] flex-1 flex-col"
        title="Enrollment ledger"
        subtitle="Latest 80 member joinings"
      >
        {rows.length === 0 ? (
          <p className="flex flex-1 items-center justify-center py-10 text-center text-sm text-slate-500">
            No enrollments yet. New member signup creates a row here.
          </p>
        ) : (
          <AdminTableShell>
            <AdminThead>
              <tr>
                <AdminTh className="w-[26%]">Member</AdminTh>
                <AdminTh className="w-[5.5rem]">Panel</AdminTh>
                <AdminTh className="w-[18%]">Sponsor</AdminTh>
                <AdminTh className="w-[5rem]">Pkg</AdminTh>
                <AdminTh className="w-[7rem]">Amount</AdminTh>
                <AdminTh className="w-[7rem]">Status</AdminTh>
                <AdminTh className="w-[11rem]">Date</AdminTh>
              </tr>
            </AdminThead>
            <tbody>
              {rows.map((r) => (
                <AdminTr key={r.id}>
                  <AdminTd>
                    <AdminMemberCell
                      memberId={r.user.id}
                      name={r.user.name}
                      memberCode={r.user.memberCode}
                      email={r.user.email}
                    />
                  </AdminTd>
                  <AdminTd>
                    <AdminPanelLink memberId={r.user.id} />
                  </AdminTd>
                  <AdminTd className="text-xs text-slate-600">
                    {r.user.sponsor ? (
                      <>
                        <span className="block truncate font-medium text-[#001a40]">
                          {r.user.sponsor.name}
                        </span>
                        <span className="block truncate text-slate-400">
                          {r.user.sponsor.memberCode}
                        </span>
                      </>
                    ) : (
                      "—"
                    )}
                  </AdminTd>
                  <AdminTd>
                    <PackageBadge packageType={r.packageType} />
                  </AdminTd>
                  <AdminTd className="font-semibold text-[#001a40]">{formatINR(r.amount)}</AdminTd>
                  <AdminTd>
                    <LedgerStatusBadge status={r.status} />
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
