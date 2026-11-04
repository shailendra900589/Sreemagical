import {
  ClubTier,
  CommissionType,
  PackageType,
  TransactionStatus,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

async function ensureEnrollment(userId: string, packageType: PackageType, amount: number) {
  const existing = await prisma.enrollment.findFirst({ where: { userId } });
  if (existing) return existing;
  return prisma.enrollment.create({
    data: {
      userId,
      packageType,
      amount,
      status: TransactionStatus.COMPLETED,
    },
  });
}

async function upsertMember(input: {
  email: string;
  password: string;
  memberCode: string;
  name: string;
  packageType: PackageType;
  role?: UserRole;
  sponsorId?: string;
  clubTier?: ClubTier;
  walletBalance?: number;
}) {
  const passwordHash = await hashPassword(input.password);
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      passwordHash,
      name: input.name,
      packageType: input.packageType,
      memberCode: input.memberCode,
      role: input.role ?? UserRole.MEMBER,
      clubTier: input.clubTier ?? ClubTier.NONE,
      walletBalance: input.walletBalance ?? 0,
      isActive: true,
      ...(input.sponsorId ? { sponsorId: input.sponsorId } : {}),
    },
    create: {
      email: input.email,
      passwordHash,
      memberCode: input.memberCode,
      name: input.name,
      packageType: input.packageType,
      role: input.role ?? UserRole.MEMBER,
      sponsorId: input.sponsorId,
      clubTier: input.clubTier ?? ClubTier.NONE,
      walletBalance: input.walletBalance ?? 0,
      isActive: true,
    },
  });
}

async function main() {
  await prisma.compensationSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const settings = await prisma.compensationSettings.findUniqueOrThrow({ where: { id: 1 } });

  const admin = await upsertMember({
    email: "admin@srimagicale.in",
    password: "admin123",
    memberCode: "SM000001",
    name: "SM Groups Admin",
    packageType: PackageType.BP,
    role: UserRole.ADMIN,
    clubTier: ClubTier.DIAMOND,
    walletBalance: 2000,
  });

  const bpMember = await upsertMember({
    email: "bp@srimagicale.in",
    password: "bp123456",
    memberCode: "SM000100",
    name: "BP Demo Member",
    packageType: PackageType.BP,
    sponsorId: admin.id,
    clubTier: ClubTier.SILVER,
    walletBalance: 125000,
  });

  await upsertMember({
    email: "demo@srimagicale.in",
    password: "demo123",
    memberCode: "SM571515",
    name: "BP Demo (legacy login)",
    packageType: PackageType.BP,
    sponsorId: admin.id,
    clubTier: ClubTier.SILVER,
    walletBalance: 2085050,
  });

  const eduMember = await upsertMember({
    email: "edu@srimagicale.in",
    password: "edu123456",
    memberCode: "SM000200",
    name: "Edu Demo Member",
    packageType: PackageType.EDU,
    sponsorId: bpMember.id,
    clubTier: ClubTier.NONE,
    walletBalance: 0,
  });

  await upsertMember({
    email: "bp-downline1@srimagicale.in",
    password: "bp123456",
    memberCode: "SM000101",
    name: "BP Team Left",
    packageType: PackageType.BP,
    sponsorId: bpMember.id,
    clubTier: ClubTier.NONE,
    walletBalance: 0,
  });

  await upsertMember({
    email: "bp-downline2@srimagicale.in",
    password: "bp123456",
    memberCode: "SM000102",
    name: "BP Team Right",
    packageType: PackageType.BP,
    sponsorId: bpMember.id,
    clubTier: ClubTier.NONE,
    walletBalance: 0,
  });

  const bpEnrollment = await ensureEnrollment(bpMember.id, PackageType.BP, settings.bpPackageFee);
  await ensureEnrollment(eduMember.id, PackageType.EDU, settings.eduPackageFee);

  const commissionCount = await prisma.commission.count({
    where: { recipientId: bpMember.id },
  });
  if (commissionCount === 0) {
    await prisma.commission.createMany({
      data: [
        {
          recipientId: bpMember.id,
          type: CommissionType.DIRECT_REFERRAL,
          amount: 500,
          percentApplied: settings.directReferralStandardPct,
          description: "Demo direct sponsor — BP joining",
        },
        {
          recipientId: bpMember.id,
          type: CommissionType.LEVEL_INCOME,
          level: 1,
          amount: 500,
          percentApplied: settings.level1Pct,
          description: "Demo level 1 income",
        },
        {
          recipientId: bpMember.id,
          enrollmentId: bpEnrollment.id,
          type: CommissionType.DIRECT_REFERRAL,
          amount: 500,
          percentApplied: settings.directReferralStandardPct,
          description: "Sample enrollment-linked commission",
        },
      ],
    });
  }

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
    const row = await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });

    for (const userId of [bpMember.id, eduMember.id]) {
      await prisma.courseProgress.upsert({
        where: { userId_courseId: { userId, courseId: row.id } },
        update: {},
        create: { userId, courseId: row.id, percent: userId === eduMember.id ? 35 : 10 },
      });
    }
  }

  console.log("[seed] Demo logins:");
  console.log("  Admin:", "admin@srimagicale.in / admin123");
  console.log("  BP:   ", "bp@srimagicale.in / bp123456  (also demo@srimagicale.in / demo123)");
  console.log("  Edu:  ", "edu@srimagicale.in / edu123456");
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
