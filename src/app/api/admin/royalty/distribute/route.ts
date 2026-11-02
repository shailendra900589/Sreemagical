import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { distributeRoyaltyForPeriod } from "@/lib/compensation";

const schema = z.object({
  periodLabel: z.string().min(3).max(40).optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const now = new Date();
  const label =
    parsed.data.periodLabel ??
    `${now.toLocaleString("en-IN", { month: "short" })} ${now.getFullYear()}`;

  const result = await distributeRoyaltyForPeriod(label);
  return NextResponse.json(result);
}
