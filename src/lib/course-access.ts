import { PackageType, User } from "@prisma/client";

export function canAccessCourse(
  user: Pick<User, "packageType">,
  packageGate: PackageType | null,
): boolean {
  if (!packageGate || packageGate === PackageType.EDU) return true;
  return user.packageType === PackageType.BP;
}
