import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { insertMemberInTeam, TeamInsertError } from "@/lib/team";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  aboveMemberCode: z.string().min(3),
  insertMemberCode: z.string().min(3),
  belowMemberCode: z.string().min(3),
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

  const [above, insert, below] = await Promise.all([
    prisma.user.findUnique({ where: { memberCode: parsed.data.aboveMemberCode } }),
    prisma.user.findUnique({ where: { memberCode: parsed.data.insertMemberCode } }),
    prisma.user.findUnique({ where: { memberCode: parsed.data.belowMemberCode } }),
  ]);

  if (!above || !insert || !below) {
    return NextResponse.json({ error: "Invalid member code(s)" }, { status: 404 });
  }

  try {
    const result = await insertMemberInTeam({
      aboveUserId: above.id,
      insertUserId: insert.id,
      belowUserId: below.id,
    });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof TeamInsertError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }
}
