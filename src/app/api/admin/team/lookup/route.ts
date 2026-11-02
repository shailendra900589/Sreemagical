import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") ?? "").trim().toUpperCase();
  if (code.length < 3) {
    return NextResponse.json({ member: null });
  }

  const member = await prisma.user.findUnique({
    where: { memberCode: code },
    select: {
      id: true,
      memberCode: true,
      name: true,
      packageType: true,
      isActive: true,
      sponsor: { select: { memberCode: true, name: true } },
      downlines: {
        take: 8,
        orderBy: { createdAt: "desc" },
        select: { memberCode: true, name: true, packageType: true },
      },
      _count: { select: { downlines: true } },
    },
  });

  if (!member) {
    return NextResponse.json({ member: null, error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({
    member: {
      memberCode: member.memberCode,
      name: member.name,
      packageType: member.packageType,
      isActive: member.isActive,
      sponsor: member.sponsor,
      directDownlines: member.downlines,
      directCount: member._count.downlines,
    },
  });
}
