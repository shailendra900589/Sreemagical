import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo.jpg";

type BrandLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = 44, className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="SM Group — Sri Magicale"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 rounded-full object-cover ring-1 ring-black/5", className)}
    />
  );
}

export const brandLogoPath = LOGO_SRC;
