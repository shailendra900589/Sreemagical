import { notFound } from "next/navigation";
import { PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { LevelAreaChart } from "@/components/dashboard/LevelAreaChart";
import { getDemoProfile, type DemoPackage } from "@/lib/demo-dashboard";

type Props = { params: Promise<{ pkg: string }> };

export default async function PreviewTeamPage({ params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();
  const profile = getDemoProfile(pkg === "bp" ? "BP" : "EDU");

  return (
    <div>
      <PageHeader
        titleHi="टीम और लेवल"
        titleEn="Team preview"
        description="10-level team depth, direct referrals aur active members ka preview."
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total team" value={String(profile.team.totalTeam)} />
        <StatCard label="Direct" value={String(profile.team.directReferrals)} />
        <StatCard label="Active" value={String(profile.team.activeMembers)} />
        <StatCard label="Depth" value={String(profile.team.levelTreeDepth)} tone="gold" />
      </div>
      <Panel title="Level distribution" subtitle="Sample chart">
        <LevelAreaChart data={profile.levelDistribution} />
        {pkg === "edu" ? (
          <p className="mt-4 text-sm text-slate-500">
            Edu members learning pe focus karte hain; team growth BP joinings se badhta hai.
          </p>
        ) : null}
      </Panel>
    </div>
  );
}
