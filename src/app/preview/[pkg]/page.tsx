import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Crown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { LevelAreaChart } from "@/components/dashboard/LevelAreaChart";
import { EmptyState, PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getDemoProfile, type DemoPackage } from "@/lib/demo-dashboard";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { formatINR } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ pkg: string }> };

export default async function PreviewHomePage({ params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();

  const demoPkg: DemoPackage = pkg === "bp" ? "BP" : "EDU";
  const profile = getDemoProfile(demoPkg);
  const base = `/preview/${pkg}`;

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  return (
    <div>
      <PageHeader
        titleHi={profile.headlineHi}
        titleEn={profile.headlineEn}
        description={profile.description}
        action={
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-[#001a40] px-4 py-2 text-sm font-semibold text-white"
          >
            Create real account <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#001a40] to-[#003366] p-5 text-white shadow-sm md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#d4af37]">Package preview</p>
              <p className="mt-1 text-2xl font-bold">
                {demoPkg === "BP" ? "Business Purpose (BP)" : "Education (Edu)"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Member ID {profile.memberCode} · Club {profile.clubTier}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Wallet balance</p>
              <p className="text-3xl font-semibold text-[#ffd54f]">
                {formatINR(profile.walletBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Earnings" value={formatINR(profile.totalEarnings)} />
          <StatCard label="Direct Referral" value={formatINR(profile.directReferralIncome)} />
          <StatCard
            label="Total Team"
            value={String(profile.team.totalTeam)}
            hint={`${profile.team.directReferrals} direct`}
          />
          <StatCard
            label="Learning"
            value={demoPkg === "EDU" ? "Full access" : "Included"}
            hint="Courses inside dashboard"
            tone="gold"
          />
        </div>

        {demoPkg === "EDU" ? (
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
            Edu preview: learning modules open. Referral, level income aur royalty BP package mein
            unlock hote hain.
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
            BP preview: business tools, team tree, royalty club aur wallet sample figures ke saath.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: `${base}/business`, icon: TrendingUp, label: "Business", text: "Referral & sponsor income" },
            { href: `${base}/team`, icon: Users, label: "My Team", text: `Depth ${profile.team.levelTreeDepth} levels` },
            { href: `${base}/courses`, icon: BookOpen, label: "Courses", text: `${courses.length} modules` },
            { href: `${base}/royalty`, icon: Crown, label: "Royalty", text: `Tier ${profile.clubTier}` },
          ].map(({ href, icon: Icon, label, text }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#d4af37]/40 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-[#9a7b1a]" />
              <p className="mt-3 text-sm font-semibold text-[#001a40]">{label}</p>
              <p className="mt-1 text-xs text-slate-500">{text}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Team growth" subtitle="Sample level distribution">
            <LevelAreaChart data={profile.levelDistribution} />
          </Panel>
          <Panel
            title="Courses"
            subtitle="Published LMS modules"
            action={
              <Link href={`${base}/courses`} className="text-sm font-medium text-[#001a40] underline">
                Open
              </Link>
            }
          >
            {courses.length === 0 ? (
              <EmptyState>No published courses yet.</EmptyState>
            ) : (
              <ul className="space-y-3">
                {courses.map((c) => (
                  <li key={c.id} className="rounded-xl border border-slate-100 p-3">
                    <p className="text-sm font-medium text-[#001a40]">{c.titleHi}</p>
                    <p className="text-xs text-slate-500">
                      {c.titleEn} · {resolveCurriculum(c).lessons.length} lessons
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel
          title="Recent earnings"
          subtitle="Sample ledger"
          action={
            <Link href={`${base}/wallet`} className="inline-flex items-center gap-1 text-sm font-medium text-[#001a40]">
              <Wallet className="h-3.5 w-3.5" /> Wallet
            </Link>
          }
        >
          {profile.recentEarnings.length === 0 ? (
            <EmptyState>Edu package — earnings after BP upgrade.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {profile.recentEarnings.map((c) => (
                <li key={c.id} className="flex justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-[#001a40]">{c.description}</p>
                    <p className="text-xs text-slate-400">
                      {c.type.replaceAll("_", " ")}
                      {c.level ? ` · L${c.level}` : ""}
                    </p>
                  </div>
                  <span className="font-semibold text-emerald-700">+{formatINR(c.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
