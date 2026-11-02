import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Crown,
  LayoutDashboard,
  Network,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { LevelAreaChart } from "@/components/dashboard/LevelAreaChart";
import { EmptyState, PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { getDashboardSummary } from "@/lib/dashboard-stats";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { encodeMemberRef, formatINR } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function MemberDashboardVisit({ member }: { member: User }) {
  const summary = await getDashboardSummary(member.id);
  const [courses, progress, recentCommissions, settings, directs] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.courseProgress.findMany({ where: { userId: member.id } }),
    prisma.commission.findMany({
      where: { recipientId: member.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.compensationSettings.findUnique({ where: { id: 1 } }),
    prisma.user.findMany({
      where: { sponsorId: member.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        name: true,
        memberCode: true,
        packageType: true,
        isActive: true,
      },
    }),
  ]);

  const progressMap = new Map(progress.map((p) => [p.courseId, p.percent]));
  const packageLabel =
    member.packageType === "BP" ? "BP" : member.packageType === "EDU" ? "Edu" : "—";
  const leftRef = encodeMemberRef(member.memberCode, "L");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const referralUrl = `${origin}/signup?Signup=${leftRef.signup}&Leg=L`;

  const avgProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce((sum, c) => sum + (progressMap.get(c.id) ?? 0), 0) / courses.length,
        );

  return (
    <div className="space-y-5">
      <div className="sm-animate-in flex flex-wrap items-center gap-2">
        <Link
          href="/admin/members"
          className="sm-press inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Members
        </Link>
        <Link
          href={`/admin/members/${member.id}`}
          className="sm-press inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          Dossier
        </Link>
      </div>

      <div className="sm-animate-scale overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-white px-4 py-3 text-sm text-amber-950 shadow-sm sm:px-5">
        <p className="font-semibold">Admin view · Candidate dashboard</p>
        <p className="mt-0.5 text-xs text-amber-800/90 sm:text-sm">
          Aap {member.name} ({member.memberCode}) ka live dashboard dekh rahe ho — read-only visit.
        </p>
      </div>

      <PageHeader
        titleHi={`${member.name.split(" ")[0]} · Dashboard`}
        titleEn={`${packageLabel} package · ${member.memberCode}`}
        description="Is candidate ke earnings, team, courses aur wallet ka complete live view."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#001a40] to-[#003366] p-4 text-white shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#d4af37]">Package</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">
              {member.packageType === "BP"
                ? "Business Purpose (BP)"
                : member.packageType === "EDU"
                  ? "Education (Edu)"
                  : "No package"}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {member.email} · Club {member.clubTier} ·{" "}
              {member.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-white/60">Wallet balance</p>
            <p className="text-2xl font-semibold text-[#ffd54f] sm:text-3xl">
              {formatINR(summary.walletBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="sm-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        <StatCard label="Total Earnings" value={formatINR(summary.totalEarnings)} />
        <StatCard label="Direct Referral" value={formatINR(summary.directReferralIncome)} />
        <StatCard
          label="Total Team"
          value={String(summary.team.totalTeam)}
          hint={`${summary.team.directReferrals} direct`}
        />
        <StatCard
          label="Learning progress"
          value={`${avgProgress}%`}
          hint="Avg of visible courses"
          tone="gold"
        />
      </div>

      <div className="sm-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { icon: LayoutDashboard, label: "Overview", text: "Live snapshot" },
          {
            icon: TrendingUp,
            label: "Business",
            text: settings?.offerActive
              ? `Offer ${settings.directReferralOfferPct}%`
              : `Direct ${settings?.directReferralStandardPct ?? 5}%`,
          },
          {
            icon: Network,
            label: "Team",
            text: `Depth ${summary.team.levelTreeDepth}`,
          },
          { icon: BookOpen, label: "Courses", text: `${courses.length} modules` },
          { icon: Crown, label: "Royalty", text: `Tier ${member.clubTier}` },
          { icon: Wallet, label: "Wallet", text: formatINR(summary.walletBalance) },
        ].map(({ icon: Icon, label, text }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4"
          >
            <Icon className="h-5 w-5 text-[#9a7b1a]" />
            <p className="mt-2 text-sm font-semibold text-[#001a40]">{label}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Team growth" subtitle="Level distribution">
          <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
            <MiniStat label="Active" value={String(summary.team.activeMembers)} />
            <MiniStat label="Direct" value={String(summary.team.directReferrals)} />
            <MiniStat label="Depth" value={String(summary.team.levelTreeDepth)} />
          </div>
          <LevelAreaChart data={summary.levelDistribution} />
          {summary.isBp ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Left referral link</p>
              <code className="mt-1 block break-all text-[11px] text-[#001a40]">{referralUrl}</code>
            </div>
          ) : (
            <p className="mt-4 text-sm text-amber-800">
              Edu / no BP — referral income locked until BP upgrade.
            </p>
          )}
        </Panel>

        <Panel title="Direct downlines" subtitle="Immediate team">
          {directs.length === 0 ? (
            <EmptyState>No direct downlines yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {directs.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#001a40]">{d.name}</p>
                    <p className="text-xs text-slate-400">{d.memberCode}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold">
                      {d.packageType ?? "—"}
                    </span>
                    <Link
                      href={`/admin/members/${d.id}/dashboard`}
                      className="sm-press rounded-full bg-[#001a40] px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Dashboard
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Courses" subtitle="Learning modules">
          {courses.length === 0 ? (
            <EmptyState>No published courses.</EmptyState>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => {
                const pct = progressMap.get(course.id) ?? 0;
                const lessons = resolveCurriculum(course).lessons.length;
                return (
                  <div key={course.id} className="rounded-xl border border-slate-100 p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#001a40]">{course.titleHi}</p>
                        <p className="text-xs text-slate-500">
                          {course.titleEn} · {lessons} lessons
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#9a7b1a]">{pct}%</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#22c55e] transition-[width] duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Recent earnings" subtitle="Wallet credits">
          {recentCommissions.length === 0 ? (
            <EmptyState>No earnings yet for this candidate.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {recentCommissions.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-[#001a40]">{c.description}</p>
                    <p className="text-xs text-slate-400">
                      {c.type.replaceAll("_", " ")}
                      {c.level ? ` · L${c.level}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-emerald-700">
                    +{formatINR(c.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-2 text-center sm:px-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-[#001a40]">{value}</p>
    </div>
  );
}
