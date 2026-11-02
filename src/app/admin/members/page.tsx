import { PageHeader, Panel } from "@/components/dashboard/ui";
import { MembersTable } from "@/components/admin/MembersTable";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminMembersPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      memberCode: true,
      name: true,
      email: true,
      packageType: true,
      clubTier: true,
      walletBalance: true,
      isActive: true,
      role: true,
      sponsor: { select: { memberCode: true, name: true } },
    },
  });

  return (
    <div>
      <PageHeader
        titleHi="Members"
        titleEn="User management"
        description="Member panel opens the exact candidate dashboard (wallet, team, courses). Use Exit to return here. Detail = full dossier. Package / club / status editable inline."
      />
      {error === "panel" ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Could not open member panel — check that the candidate is active and not an admin account.
        </p>
      ) : null}
      <Panel
        title="All candidates"
        subtitle="Each row: Member panel · Detail · Copy code — always visible, no hidden menus"
      >
        <MembersTable initial={members} />
      </Panel>
    </div>
  );
}
