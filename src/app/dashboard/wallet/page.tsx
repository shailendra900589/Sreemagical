import { EmptyState, PageHeader, Panel } from "@/components/dashboard/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function WalletPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const commissions = await prisma.commission.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <PageHeader
        titleHi="वॉलेट"
        titleEn="Wallet & Earnings"
        description="Your available balance and commission ledger."
      />

      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#001a40] via-[#002b5c] to-[#0a1f3d] p-6 text-white shadow-md md:p-8">
          <p className="text-sm text-white/70">Available balance</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-[#ffd54f]">
            {formatINR(user.walletBalance)}
          </p>
          <p className="mt-2 text-xs text-white/55">Credited from direct, level, and royalty incomes</p>
        </div>

        <Panel title="Recent earnings" subtitle="Latest 50 commission entries">
          {commissions.length === 0 ? (
            <EmptyState>No commission entries yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {commissions.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-4 py-3.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-[#001a40]">{c.description}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {c.type.replaceAll("_", " ")}
                      {c.level ? ` · Level ${c.level}` : ""} · {c.percentApplied}%
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-emerald-700">+{formatINR(c.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
