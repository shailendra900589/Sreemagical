import { notFound } from "next/navigation";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getDemoProfile, type DemoPackage } from "@/lib/demo-dashboard";
import { getCompensationSettings } from "@/lib/settings";

type Props = { params: Promise<{ pkg: string }> };

export default async function PreviewRoyaltyPage({ params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();
  const demoPkg: DemoPackage = pkg === "bp" ? "BP" : "EDU";
  const profile = getDemoProfile(demoPkg);
  const settings = await getCompensationSettings();

  return (
    <div>
      <PageHeader
        titleHi="रॉयल्टी क्लब"
        titleEn="Royalty preview"
        description="Silver / Gold / Diamond club pools — BP members qualify on team strength."
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Your tier" value={profile.clubTier} tone="gold" />
        <StatCard label="Total royalty %" value={`${settings.royaltyTotalPct}%`} />
        <StatCard label="Silver pool" value={`${settings.silverPoolPct}%`} />
        <StatCard label="Gold pool" value={`${settings.goldPoolPct}%`} />
      </div>
      <Panel title="Qualification rules">
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            Silver — min {settings.silverMinDirectBp} direct BP · {settings.silverMinTeamBp} team BP
          </li>
          <li>
            Gold — min {settings.goldMinDirectBp} direct BP · {settings.goldMinTeamBp} team BP
          </li>
          <li>
            Diamond — min {settings.diamondMinDirectBp} direct BP · {settings.diamondMinTeamBp} team
            BP
          </li>
        </ul>
        {demoPkg === "EDU" ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Edu preview: royalty club BP package ke baad activate hota hai.
          </p>
        ) : (
          <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            BP demo tier: {profile.clubTier}. Real qualification login ke baad live team pe calculate
            hoti hai.
          </p>
        )}
      </Panel>
    </div>
  );
}
