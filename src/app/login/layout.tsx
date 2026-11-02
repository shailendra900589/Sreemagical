import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Member Login",
  description:
    "Secure member login to Sri Magicale dashboard — access courses, team, wallet, and BP business tools.",
  path: "/login",
  keywords: ["member login", "Sri Magicale login", "dashboard login"],
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
