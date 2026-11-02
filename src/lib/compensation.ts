import { ClubTier, CommissionType, PackageType, User } from "@prisma/client";
import { prisma } from "./prisma";
import {
  directReferralPercent,
  getCompensationSettings,
  levelPercentsFromSettings,
} from "./settings";

async function getUplineChain(userId: string, maxDepth: number): Promise<User[]> {
  const chain: User[] = [];
  let currentId: string | null = userId;

  for (let i = 0; i < maxDepth; i++) {
    if (!currentId) break;
    const user: User | null = await prisma.user.findUnique({ where: { id: currentId } });
    if (!user?.sponsorId) break;
    const sponsor: User | null = await prisma.user.findUnique({ where: { id: user.sponsorId } });
    if (!sponsor) break;
    chain.push(sponsor);
    currentId = sponsor.id;
  }

  return chain;
}

function isBpEligible(user: User | null | undefined): user is User {
  return !!user && user.packageType === PackageType.BP && user.isActive;
}

export async function processEnrollmentCommissions(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: true },
  });

  if (!enrollment || enrollment.packageType !== PackageType.BP) {
    return { commissions: [] as string[] };
  }

  const settings = await getCompensationSettings();
  const levelPercents = levelPercentsFromSettings(settings);
  const baseAmount = enrollment.amount;
  const createdCommissionIds: string[] = [];

  const newMember = enrollment.user;
  if (!newMember.sponsorId) {
    return { commissions: createdCommissionIds };
  }

  const sponsor = await prisma.user.findUnique({ where: { id: newMember.sponsorId } });
  if (isBpEligible(sponsor)) {
    const pct = directReferralPercent(settings);
    const amount = (baseAmount * pct) / 100;
    const commission = await prisma.$transaction(async (tx) => {
      const row = await tx.commission.create({
        data: {
          recipientId: sponsor.id,
          sourceUserId: newMember.id,
          enrollmentId: enrollment.id,
          type: CommissionType.DIRECT_REFERRAL,
          amount,
          percentApplied: pct,
          description: `Direct sponsor income (${pct}% on BP joining)`,
        },
      });
      await tx.user.update({
        where: { id: sponsor.id },
        data: { walletBalance: { increment: amount } },
      });
      return row;
    });
    createdCommissionIds.push(commission.id);
  }

  const uplines = await getUplineChain(newMember.id, 10);
  for (let levelIndex = 0; levelIndex < uplines.length && levelIndex < 10; levelIndex++) {
    const upline = uplines[levelIndex];
    if (!isBpEligible(upline)) continue;

    const pct = levelPercents[levelIndex];
    const amount = (baseAmount * pct) / 100;
    const levelNumber = levelIndex + 1;

    const commission = await prisma.$transaction(async (tx) => {
      const row = await tx.commission.create({
        data: {
          recipientId: upline.id,
          sourceUserId: newMember.id,
          enrollmentId: enrollment.id,
          type: CommissionType.LEVEL_INCOME,
          level: levelNumber,
          amount,
          percentApplied: pct,
          description: `Level ${levelNumber} distribution (${pct}%)`,
        },
      });
      await tx.user.update({
        where: { id: upline.id },
        data: { walletBalance: { increment: amount } },
      });
      return row;
    });
    createdCommissionIds.push(commission.id);
  }

  return { commissions: createdCommissionIds };
}

export async function distributeRoyaltyForPeriod(periodLabel: string) {
  const settings = await getCompensationSettings();
  const since = new Date();
  since.setMonth(since.getMonth() - 1);

  const turnoverAgg = await prisma.enrollment.aggregate({
    where: {
      packageType: PackageType.BP,
      createdAt: { gte: since },
    },
    _sum: { amount: true },
  });

  const totalTurnover = turnoverAgg._sum.amount ?? 0;
  if (totalTurnover <= 0) {
    return { periodLabel, totalTurnover: 0, payouts: [] as { tier: string; amount: number; members: number }[] };
  }

  const pools = [
    { tier: ClubTier.SILVER, pct: settings.silverPoolPct, type: CommissionType.ROYALTY_SILVER },
    { tier: ClubTier.GOLD, pct: settings.goldPoolPct, type: CommissionType.ROYALTY_GOLD },
    { tier: ClubTier.DIAMOND, pct: settings.diamondPoolPct, type: CommissionType.ROYALTY_DIAMOND },
  ];

  const payouts: { tier: string; amount: number; members: number }[] = [];

  await prisma.royaltyCycle.create({
    data: { periodLabel, totalTurnover },
  });

  for (const pool of pools) {
    const poolAmount = (totalTurnover * pool.pct) / 100;
    const members = await prisma.user.findMany({
      where: { clubTier: pool.tier, packageType: PackageType.BP, isActive: true },
    });
    if (members.length === 0) {
      payouts.push({ tier: pool.tier, amount: poolAmount, members: 0 });
      continue;
    }

    const share = poolAmount / members.length;
    for (const member of members) {
      await prisma.$transaction(async (tx) => {
        await tx.commission.create({
          data: {
            recipientId: member.id,
            type: pool.type,
            amount: share,
            percentApplied: pool.pct,
            description: `${pool.tier} royalty pool (${periodLabel})`,
          },
        });
        await tx.user.update({
          where: { id: member.id },
          data: { walletBalance: { increment: share } },
        });
      });
    }
    payouts.push({ tier: pool.tier, amount: poolAmount, members: members.length });
  }

  return { periodLabel, totalTurnover, payouts };
}
