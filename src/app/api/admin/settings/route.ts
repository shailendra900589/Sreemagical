import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  directReferralStandardPct: z.number().min(0).max(100).optional(),
  directReferralOfferPct: z.number().min(0).max(100).optional(),
  offerActive: z.boolean().optional(),
  level1Pct: z.number().min(0).max(100).optional(),
  level2Pct: z.number().min(0).max(100).optional(),
  level3Pct: z.number().min(0).max(100).optional(),
  level4Pct: z.number().min(0).max(100).optional(),
  level5Pct: z.number().min(0).max(100).optional(),
  level6Pct: z.number().min(0).max(100).optional(),
  level7Pct: z.number().min(0).max(100).optional(),
  level8Pct: z.number().min(0).max(100).optional(),
  level9Pct: z.number().min(0).max(100).optional(),
  level10Pct: z.number().min(0).max(100).optional(),
  royaltyTotalPct: z.number().min(0).max(100).optional(),
  silverPoolPct: z.number().min(0).max(100).optional(),
  goldPoolPct: z.number().min(0).max(100).optional(),
  diamondPoolPct: z.number().min(0).max(100).optional(),
  silverMinDirectBp: z.number().int().min(0).optional(),
  goldMinDirectBp: z.number().int().min(0).optional(),
  diamondMinDirectBp: z.number().int().min(0).optional(),
  silverMinTeamBp: z.number().int().min(0).optional(),
  goldMinTeamBp: z.number().int().min(0).optional(),
  diamondMinTeamBp: z.number().int().min(0).optional(),
  eduPackageFee: z.number().min(0).optional(),
  bpPackageFee: z.number().min(0).optional(),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.compensationSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await prisma.compensationSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  return NextResponse.json(settings);
}
