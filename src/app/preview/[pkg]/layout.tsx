import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewShell } from "@/components/dashboard/PreviewShell";
import { getDemoProfile, type DemoPackage } from "@/lib/demo-dashboard";
import { createMetadata } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ pkg: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pkg: string }>;
}): Promise<Metadata> {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") {
    return createMetadata({
      title: "Dashboard Preview",
      description: "Sri Magicale package dashboard preview.",
      path: "/preview",
      noIndex: true,
    });
  }

  const isBp = pkg === "bp";
  return createMetadata({
    title: isBp ? "BP Dashboard Preview" : "Edu Dashboard Preview",
    description: isBp
      ? "Preview the Sri Magicale Business Purpose (BP) member dashboard — referrals, team, royalty, wallet and courses. No login required."
      : "Preview the Sri Magicale Education (Edu) member dashboard — courses and learning progress. No login required.",
    path: `/preview/${pkg}`,
    keywords: isBp
      ? ["BP dashboard preview", "business purpose demo"]
      : ["Edu dashboard preview", "education package demo"],
  });
}

export default async function PreviewLayout({ children, params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();

  const demoPkg: DemoPackage = pkg === "bp" ? "BP" : "EDU";
  const profile = getDemoProfile(demoPkg);

  return (
    <PreviewShell
      pkg={pkg}
      userName={profile.userName}
      packageLabel={profile.packageLabel}
      memberCode={profile.memberCode}
    >
      {children}
    </PreviewShell>
  );
}
