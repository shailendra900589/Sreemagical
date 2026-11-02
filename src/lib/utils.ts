import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function encodeMemberRef(memberCode: string, leg: "L" | "R" = "L") {
  const payload = Buffer.from(memberCode, "utf8").toString("base64url");
  return { signup: payload, leg };
}

export function decodeMemberRef(signup: string): string | null {
  try {
    return Buffer.from(signup, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export function generateMemberCode(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `SM${n}`;
}
