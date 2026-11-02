import { CopyReferralButton } from "@/components/dashboard/CopyReferralButton";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardSummary } from "@/lib/dashboard-stats";
import { directReferralPercent, getCompensationSettings } from "@/lib/settings";
import { encodeMemberRef, formatINR } from "@/lib/utils";

export default async function BusinessPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const summary = await getDashboardSummary(user.id);
  const settings = await getCompensationSettings();
  const directPct = directReferralPercent(settings);
  const leftRef = encodeMemberRef(user.memberCode, "L");
  const rightRef = encodeMemberRef(user.memberCode, "R");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const leftUrl = `${origin}/signup?Signup=${leftRef.signup}&Leg=L`;
  const rightUrl = `${origin}/signup?Signup=${rightRef.signup}&Leg=R`;

  return (
    <div>
      <PageHeader
        titleHi="व्यवसाय"
        titleEn="Business"
        description="Share referral links and track sponsor income from BP joinings."
      />

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Earnings" value={formatINR(summary.totalEarnings)} />
          <StatCard label="Direct Referral" value={formatINR(summary.directReferralIncome)} />
          <StatCard label="Wallet" value={formatINR(summary.walletBalance)} tone="success" />
        </div>

        <Panel title="Referral links" subtitle={`Member ID · ${user.memberCode}`}>
          {!summary.isBp ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              BP package required for referral commissions.
            </div>
          ) : (
            <div className="space-y-3">
              <RefCard label="Left Referral Link" url={leftUrl} />
              <RefCard label="Right Referral Link" url={rightUrl} />
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Direct sponsor income:{" "}
                <strong className="text-[#001a40]">
                  {directPct}% ({formatINR((settings.bpPackageFee * directPct) / 100)} per BP join)
                </strong>
                {settings.offerActive ? (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    Offer active
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function RefCard({ label, url }: { label: string; url: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <CopyReferralButton url={url} />
      </div>
      <code className="mt-2 block break-all rounded-lg bg-slate-50 px-3 py-2 text-xs text-[#001a40]">
        {url}
      </code>
    </div>
  );
}
