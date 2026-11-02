import { CompensationSettings } from "@prisma/client";
import { prisma } from "./prisma";

export async function getCompensationSettings(): Promise<CompensationSettings> {
  const settings = await prisma.compensationSettings.findUnique({ where: { id: 1 } });
  if (settings) return settings;

  return prisma.compensationSettings.create({ data: { id: 1 } });
}

export function levelPercentsFromSettings(settings: CompensationSettings): number[] {
  return [
    settings.level1Pct,
    settings.level2Pct,
    settings.level3Pct,
    settings.level4Pct,
    settings.level5Pct,
    settings.level6Pct,
    settings.level7Pct,
    settings.level8Pct,
    settings.level9Pct,
    settings.level10Pct,
  ];
}

export function directReferralPercent(settings: CompensationSettings): number {
  return settings.offerActive
    ? settings.directReferralOfferPct
    : settings.directReferralStandardPct;
}
