import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { packageType: { not: null } } });
  for (const u of users) {
    const count = await prisma.enrollment.count({ where: { userId: u.id } });
    if (count === 0 && u.packageType) {
      const amount = u.packageType === "BP" ? 10000 : 5000;
      await prisma.enrollment.create({
        data: { userId: u.id, packageType: u.packageType, amount },
      });
      console.log("Created enrollment for", u.memberCode, amount);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
