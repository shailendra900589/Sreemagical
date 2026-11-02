import { notFound, redirect } from "next/navigation";
import { memberPanelHref } from "@/lib/admin-member-links";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

/** Legacy URL — always open the real member `/dashboard` (admin impersonation). */
export default async function AdminMemberDashboardPage({ params }: Props) {
  const { id } = await params;
  const member = await prisma.user.findUnique({ where: { id } });
  if (!member || member.role === "ADMIN") notFound();

  redirect(memberPanelHref(id));
}
