import { NextResponse } from "next/server";
import { endMemberImpersonation } from "@/lib/impersonation";

export async function POST(request: Request) {
  const restored = await endMemberImpersonation();
  const target = restored ? "/admin/members" : "/login?next=/admin";
  return NextResponse.redirect(new URL(target, request.url));
}
