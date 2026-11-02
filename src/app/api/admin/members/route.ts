import { ClubTier, PackageType, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const members = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { memberCode: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      memberCode: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      packageType: true,
      clubTier: true,
      walletBalance: true,
      isActive: true,
      createdAt: true,
      sponsor: { select: { memberCode: true, name: true } },
    },
  });

  return NextResponse.json({ members });
}

const patchSchema = z.object({
  id: z.string().min(1),
  packageType: z.enum(["EDU", "BP"]).nullable().optional(),
  clubTier: z.enum(["NONE", "SILVER", "GOLD", "DIAMOND"]).optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["MEMBER", "ADMIN"]).optional(),
});

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id, ...data } = parsed.data;
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(data.packageType !== undefined
        ? { packageType: data.packageType as PackageType | null }
        : {}),
      ...(data.clubTier ? { clubTier: data.clubTier as ClubTier } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.role ? { role: data.role as UserRole } : {}),
    },
  });

  return NextResponse.json({ ok: true, user });
}
