import { ClubTier, PackageType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  await prisma.compensationSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@srimagicale.in" },
    update: {},
    create: {
      memberCode: "SM000001",
      email: "admin@srimagicale.in",
      passwordHash: adminPassword,
      name: "SM Groups Admin",
      role: UserRole.ADMIN,
      packageType: PackageType.BP,
      clubTier: ClubTier.DIAMOND,
      walletBalance: 2000,
    },
  });

  const demoPassword = await hashPassword("demo123");
  await prisma.user.upsert({
    where: { email: "demo@srimagicale.in" },
    update: {},
    create: {
      memberCode: "SM571515",
      email: "demo@srimagicale.in",
      passwordHash: demoPassword,
      name: "Demo Member",
      role: UserRole.MEMBER,
      packageType: PackageType.BP,
      sponsorId: admin.id,
      clubTier: ClubTier.SILVER,
      walletBalance: 2085050,
    },
  });

  const courses = [
    {
      slug: "class-8-12-curriculum",
      titleHi: "कक्षा 8–12 पाठ्यक्रम",
      titleEn: "Class 8–12 Curriculum",
      category: "school",
      packageGate: PackageType.EDU,
      sortOrder: 1,
    },
    {
      slug: "competitive-exam-prep",
      titleHi: "प्रतियोगी परीक्षा तैयारी",
      titleEn: "Competitive Exam Prep",
      category: "school",
      packageGate: PackageType.EDU,
      sortOrder: 2,
    },
    {
      slug: "trading-education",
      titleHi: "ट्रेडिंग शिक्षा (Stock & Forex)",
      titleEn: "Trading Education",
      category: "trading",
      packageGate: PackageType.BP,
      sortOrder: 3,
    },
    {
      slug: "technical-analysis",
      titleHi: "टेक्निकल एवं फंडामेंटल विश्लेषण",
      titleEn: "Technical & Fundamental Analysis",
      category: "trading",
      packageGate: PackageType.BP,
      sortOrder: 4,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
