import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { SESSION_COOKIE, createSession, sessionExpiry } from "./auth";

export const ADMIN_RESTORE_COOKIE = "sm_admin_restore";

export type ImpersonationBanner = {
  active: true;
  memberName: string;
  memberCode: string;
};

export async function getImpersonationBanner(): Promise<ImpersonationBanner | null> {
  const cookieStore = await cookies();
  const restore = cookieStore.get(ADMIN_RESTORE_COOKIE)?.value;
  if (!restore) return null;

  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { select: { name: true, memberCode: true, role: true } } },
  });
  if (!session?.user || session.user.role === "ADMIN") return null;

  return {
    active: true,
    memberName: session.user.name,
    memberCode: session.user.memberCode,
  };
}

/** Swap admin session cookie for a member session; keep admin token in restore cookie. */
export async function startMemberImpersonation(adminSessionToken: string, memberId: string) {
  const member = await prisma.user.findUnique({ where: { id: memberId } });
  if (!member || member.role === "ADMIN" || !member.isActive) {
    throw new Error("INVALID_MEMBER");
  }

  const adminSession = await prisma.session.findUnique({ where: { token: adminSessionToken } });
  if (!adminSession) throw new Error("INVALID_ADMIN_SESSION");

  const adminUser = await prisma.user.findUnique({ where: { id: adminSession.userId } });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("FORBIDDEN");

  await createSession(member.id);

  const cookieStore = await cookies();
  const expires = sessionExpiry();
  cookieStore.set(ADMIN_RESTORE_COOKIE, adminSessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

/** Restore admin session after impersonation. */
export async function endMemberImpersonation(): Promise<boolean> {
  const cookieStore = await cookies();
  const restoreToken = cookieStore.get(ADMIN_RESTORE_COOKIE)?.value;
  const memberToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (memberToken) {
    await prisma.session.deleteMany({ where: { token: memberToken } });
  }

  cookieStore.delete(ADMIN_RESTORE_COOKIE);

  if (!restoreToken) return false;

  const adminSession = await prisma.session.findUnique({ where: { token: restoreToken } });
  if (!adminSession || adminSession.expiresAt < new Date()) {
    if (adminSession) {
      await prisma.session.delete({ where: { id: adminSession.id } }).catch(() => undefined);
    }
    return false;
  }

  cookieStore.set(SESSION_COOKIE, restoreToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: adminSession.expiresAt,
  });

  return true;
}
