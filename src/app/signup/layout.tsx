import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Join Sri Magicale",
  description:
    "Sign up for Sri Magicale — choose Edu (₹5,000) for learning or Business Purpose BP (₹10,000) for education plus transparent income opportunities.",
  path: "/signup",
  keywords: [
    "join Sri Magicale",
    "Edu package signup",
    "BP package join",
    "education MLM India register",
  ],
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
