import { CommissionType, PackageType } from "@prisma/client";
import { prisma } from "./prisma";
import { countTeamStats } from "./team";

export async function getLevelDistribution(userId: string) {
  const users = await prisma.user.findMany({ select: { id: true, sponsorId: true } });
  const byLevel: number[] = Array.from({ length: 10 }, () => 0);

  function walkFrom(rootId: string, level: number) {
    if (level > 10) return;
    const children = users.filter((u) => u.sponsorId === rootId);
    for (const child of children) {
      if (level >= 1 && level <= 10) byLevel[level - 1] += 1;
      walkFrom(child.id, level + 1);
    }
  }
  walkFrom(userId, 1);

  return byLevel.map((count, i) => ({ level: `L${i + 1}`, count }));
}

export async function getDashboardSummary(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const team = await countTeamStats(userId);

  const directIncome = await prisma.commission.aggregate({
    where: { recipientId: userId, type: CommissionType.DIRECT_REFERRAL },
    _sum: { amount: true },
  });

  const totalEarnings = await prisma.commission.aggregate({
    where: { recipientId: userId },
    _sum: { amount: true },
  });

  const levelDistribution = await getLevelDistribution(userId);

  return {
    user,
    team,
    walletBalance: user.walletBalance,
    directReferralIncome: directIncome._sum.amount ?? 0,
    totalEarnings: totalEarnings._sum.amount ?? 0,
    levelDistribution,
    isBp: user.packageType === PackageType.BP,
  };
}
