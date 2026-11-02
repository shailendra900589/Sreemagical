import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/lib/auth";
import { ADMIN_RESTORE_COOKIE, endMemberImpersonation } from "@/lib/impersonation";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_RESTORE_COOKIE)?.value) {
    await endMemberImpersonation();
    return NextResponse.redirect(new URL("/admin/members", request.url));
  }
  await destroySession();
  return NextResponse.redirect(new URL("/", request.url));
}
