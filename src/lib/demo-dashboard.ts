import { formatINR } from "@/lib/utils";

export type DemoPackage = "EDU" | "BP";

export function getDemoProfile(pkg: DemoPackage) {
  if (pkg === "BP") {
    return {
      packageType: "BP" as const,
      packageLabel: "BP",
      userName: "BP Demo Member",
      memberCode: "SM-DEMO-BP",
      clubTier: "GOLD",
      walletBalance: 28450,
      totalEarnings: 41200,
      directReferralIncome: 15000,
      team: { totalTeam: 48, directReferrals: 12, activeMembers: 41, levelTreeDepth: 6 },
      levelDistribution: [
        { level: "L1", count: 12 },
        { level: "L2", count: 10 },
        { level: "L3", count: 8 },
        { level: "L4", count: 7 },
        { level: "L5", count: 5 },
        { level: "L6", count: 4 },
        { level: "L7", count: 1 },
        { level: "L8", count: 1 },
        { level: "L9", count: 0 },
        { level: "L10", count: 0 },
      ],
      recentEarnings: [
        { id: "1", description: "Direct referral — BP joining", type: "DIRECT_REFERRAL", amount: 500 },
        { id: "2", description: "Level 2 income", type: "LEVEL_INCOME", level: 2, amount: 1000 },
        { id: "3", description: "Gold royalty share", type: "ROYALTY_GOLD", amount: 2200 },
      ],
      coursesFocus: false,
      headlineHi: "BP Business Dashboard",
      headlineEn: "Preview · no login required",
      description:
        "Business Purpose package preview — referral links, team levels, royalty club aur wallet. Yeh demo hai; real data login ke baad dikhega.",
    };
  }

  return {
    packageType: "EDU" as const,
    packageLabel: "Edu",
    userName: "Edu Demo Student",
    memberCode: "SM-DEMO-EDU",
    clubTier: "NONE",
    walletBalance: 0,
    totalEarnings: 0,
    directReferralIncome: 0,
    team: { totalTeam: 0, directReferrals: 0, activeMembers: 0, levelTreeDepth: 0 },
    levelDistribution: Array.from({ length: 10 }, (_, i) => ({ level: `L${i + 1}`, count: 0 })),
    recentEarnings: [] as { id: string; description: string; type: string; level?: number; amount: number }[],
    coursesFocus: true,
    headlineHi: "Edu Learning Dashboard",
    headlineEn: "Preview · no login required",
    description:
      "Education package preview — courses, lessons aur learning progress. Referral/royalty BP upgrade ke baad unlock hote hain. Login ki zarurat nahi is preview ke liye.",
  };
}

export function demoWalletLabel(amount: number) {
  return formatINR(amount);
}
