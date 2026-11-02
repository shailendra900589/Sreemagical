import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { reparentMember, TeamInsertError } from "@/lib/team";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  memberMemberCode: z.string().min(3),
  sponsorMemberCode: z.string().min(3),
});

export async function POST(request: Request) {
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

  const [member, sponsor] = await Promise.all([
    prisma.user.findUnique({ where: { memberCode: parsed.data.memberMemberCode.trim().toUpperCase() } }),
    prisma.user.findUnique({ where: { memberCode: parsed.data.sponsorMemberCode.trim().toUpperCase() } }),
  ]);

  if (!member || !sponsor) {
    return NextResponse.json({ error: "Invalid member code(s)" }, { status: 404 });
  }

  try {
    const result = await reparentMember({
      memberUserId: member.id,
      newSponsorUserId: sponsor.id,
    });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof TeamInsertError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }
}
