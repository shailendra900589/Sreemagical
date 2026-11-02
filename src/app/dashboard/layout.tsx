import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { getCurrentUser } from "@/lib/auth";
import { getImpersonationBanner } from "@/lib/impersonation";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Member Dashboard",
  description: "Private Sri Magicale member dashboard.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "ADMIN") redirect("/admin");

  const packageLabel = user.packageType === "BP" ? "BP" : user.packageType === "EDU" ? "Edu" : "—";
  const impersonation = await getImpersonationBanner();

  return (
    <>
      {impersonation ? (
        <ImpersonationBanner
          memberName={impersonation.memberName}
          memberCode={impersonation.memberCode}
        />
      ) : null}
      <DashboardShell
        userName={user.name}
        packageLabel={packageLabel}
        memberCode={user.memberCode}
        impersonating={!!impersonation}
      >
        {children}
      </DashboardShell>
    </>
  );
}
