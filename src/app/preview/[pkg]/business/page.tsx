import { notFound } from "next/navigation";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getDemoProfile, type DemoPackage } from "@/lib/demo-dashboard";
import { formatINR } from "@/lib/utils";
import { getCompensationSettings } from "@/lib/settings";

type Props = { params: Promise<{ pkg: string }> };

export default async function PreviewBusinessPage({ params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();
  const demoPkg: DemoPackage = pkg === "bp" ? "BP" : "EDU";
  const profile = getDemoProfile(demoPkg);
  const settings = await getCompensationSettings();

  return (
    <div>
      <PageHeader
        titleHi="व्यवसाय"
        titleEn="Business preview"
        description="Referral links aur sponsor income — BP package mein fully active."
      />
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Earnings" value={formatINR(profile.totalEarnings)} />
          <StatCard label="Direct Referral" value={formatINR(profile.directReferralIncome)} />
          <StatCard label="Wallet" value={formatINR(profile.walletBalance)} tone="success" />
        </div>
        <Panel title="Referral links" subtitle={`Demo ID · ${profile.memberCode}`}>
          {demoPkg !== "BP" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Edu preview: BP upgrade ke baad left/right referral links aur direct sponsor income
              unlock hote hain (standard {settings.directReferralStandardPct}%).
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Left referral (demo)</p>
                <code className="mt-2 block break-all rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  https://srimagicale.in/signup?Signup=DEMO-LEFT&Leg=L
                </code>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Right referral (demo)</p>
                <code className="mt-2 block break-all rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  https://srimagicale.in/signup?Signup=DEMO-RIGHT&Leg=R
                </code>
              </div>
              <p className="text-slate-600">
                Direct sponsor: <strong>{settings.directReferralStandardPct}%</strong> of BP fee (
                {formatINR(settings.bpPackageFee)}).
              </p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
