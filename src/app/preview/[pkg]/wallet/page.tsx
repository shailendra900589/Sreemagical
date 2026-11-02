import { notFound } from "next/navigation";
import { EmptyState, PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getDemoProfile, type DemoPackage } from "@/lib/demo-dashboard";
import { formatINR } from "@/lib/utils";

type Props = { params: Promise<{ pkg: string }> };

export default async function PreviewWalletPage({ params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();
  const profile = getDemoProfile((pkg === "bp" ? "BP" : "EDU") as DemoPackage);

  return (
    <div>
      <PageHeader
        titleHi="वॉलेट"
        titleEn="Wallet preview"
        description="Commission credits aur balance — sample figures for package demo."
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <StatCard label="Balance" value={formatINR(profile.walletBalance)} tone="success" />
        <StatCard label="Lifetime earnings" value={formatINR(profile.totalEarnings)} />
      </div>
      <Panel title="Ledger" subtitle="Demo entries">
        {profile.recentEarnings.length === 0 ? (
          <EmptyState>Edu wallet empty until BP income starts.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {profile.recentEarnings.map((c) => (
              <li key={c.id} className="flex justify-between py-3">
                <span>{c.description}</span>
                <span className="font-semibold text-emerald-700">+{formatINR(c.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
