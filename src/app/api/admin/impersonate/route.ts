import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser, SESSION_COOKIE } from "@/lib/auth";
import { startMemberImpersonation } from "@/lib/impersonation";

export async function GET(request: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login?next=/admin/members", request.url));
  }

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId")?.trim();
  if (!memberId) {
    return NextResponse.redirect(new URL("/admin/members", request.url));
  }

  const cookieStore = await cookies();
  const adminToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!adminToken) {
    return NextResponse.redirect(new URL("/login?next=/admin/members", request.url));
  }

  try {
    await startMemberImpersonation(adminToken, memberId);
  } catch {
    return NextResponse.redirect(new URL("/admin/members?error=panel", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
