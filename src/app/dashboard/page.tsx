import Link from "next/link";
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
import { getCurrentUser } from "@/lib/auth";
import { getDashboardSummary } from "@/lib/dashboard-stats";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { encodeMemberRef, formatINR } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const summary = await getDashboardSummary(user.id);
  const [courses, progress, recentCommissions, settings] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    prisma.courseProgress.findMany({ where: { userId: user.id } }),
    prisma.commission.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.compensationSettings.findUnique({ where: { id: 1 } }),
  ]);
  const progressMap = new Map(progress.map((p) => [p.courseId, p.percent]));
  const leftRef = encodeMemberRef(user.memberCode, "L");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const referralUrl = `${origin}/signup?Signup=${leftRef.signup}&Leg=L`;

  const avgProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce((sum, c) => sum + (progressMap.get(c.id) ?? 0), 0) / courses.length,
        );

  return (
    <div>
      <PageHeader
        titleHi={`स्वागत है, ${user.name.split(" ")[0]}`}
        titleEn="Member dashboard"
        description="Earnings, team growth, courses aur royalty — ek professional overview."
        action={
          summary.isBp ? (
            <Link
              href="/dashboard/business"
              className="inline-flex items-center gap-2 rounded-full bg-[#001a40] px-4 py-2 text-sm font-semibold text-white"
            >
              Referral links <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#001a40]"
            >
              Continue learning <ArrowRight className="h-4 w-4" />
            </Link>
          )
        }
      />

      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#001a40] to-[#003366] p-5 text-white shadow-sm md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#d4af37]">Package</p>
              <p className="mt-1 text-2xl font-bold">
                {user.packageType === "BP"
                  ? "Business Purpose (BP)"
                  : user.packageType === "EDU"
                    ? "Education (Edu)"
                    : "No package"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Member ID {user.memberCode} · Club {user.clubTier}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Wallet balance</p>
              <p className="text-3xl font-semibold text-[#ffd54f]">
                {formatINR(summary.walletBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        {!summary.isBp && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Education package active — referral, level, and royalty income require BP upgrade.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/dashboard/business",
              icon: TrendingUp,
              label: "Business",
              text: settings?.offerActive
                ? `Offer ${settings.directReferralOfferPct}% live`
                : `Direct ${settings?.directReferralStandardPct ?? 5}%`,
            },
            {
              href: "/dashboard/team",
              icon: Users,
              label: "My Team",
              text: `Depth ${summary.team.levelTreeDepth} levels`,
            },
            {
              href: "/dashboard/courses",
              icon: BookOpen,
              label: "Courses",
              text: `${courses.length} modules ready`,
            },
            {
              href: "/dashboard/royalty",
              icon: Crown,
              label: "Royalty",
              text: `Tier ${user.clubTier}`,
            },
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
          <Panel title="जाइनिंग और टीम व्यवसाय" subtitle="Team growth by level">
            <div className="mb-4 grid grid-cols-3 gap-3">
              <MiniStat label="Active" value={String(summary.team.activeMembers)} />
              <MiniStat label="Direct" value={String(summary.team.directReferrals)} />
              <MiniStat label="Depth" value={String(summary.team.levelTreeDepth)} />
            </div>
            <LevelAreaChart data={summary.levelDistribution} />
            {summary.isBp && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Left referral link</p>
                <code className="mt-1 block break-all text-[11px] text-[#001a40]">{referralUrl}</code>
              </div>
            )}
          </Panel>

          <Panel
            title="शिक्षा और कोर्स"
            subtitle="Continue learning"
            action={
              <Link href="/dashboard/courses" className="text-sm font-medium text-[#001a40] hover:underline">
                View all
              </Link>
            }
          >
            {courses.length === 0 ? (
              <EmptyState>No published courses yet.</EmptyState>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => {
                  const pct = progressMap.get(course.id) ?? 0;
                  const lessons = resolveCurriculum(course).lessons.length;
                  return (
                    <Link
                      key={course.id}
                      href={`/dashboard/courses/${course.slug}`}
                      className="block rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-[#d4af37]/40 hover:bg-slate-50/80"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#001a40]">{course.titleHi}</p>
                          <p className="text-xs text-slate-500">
                            {course.titleEn} · {lessons} lessons
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#9a7b1a]">{pct}%</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#22c55e]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        <Panel
          title="Recent earnings"
          subtitle="Latest wallet credits"
          action={
            <Link href="/dashboard/wallet" className="inline-flex items-center gap-1 text-sm font-medium text-[#001a40] hover:underline">
              <Wallet className="h-3.5 w-3.5" /> Wallet
            </Link>
          }
        >
          {recentCommissions.length === 0 ? (
            <EmptyState>No earnings yet. BP joinings create commission entries.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {recentCommissions.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 py-3">
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-[#001a40]">{value}</p>
    </div>
  );
}
