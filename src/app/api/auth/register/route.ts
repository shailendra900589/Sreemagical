import { PackageType, PlacementLeg } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, hashPassword } from "@/lib/auth";
import { processEnrollmentCommissions } from "@/lib/compensation";
import { prisma } from "@/lib/prisma";
import { decodeMemberRef, generateMemberCode } from "@/lib/utils";
import { getCompensationSettings } from "@/lib/settings";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  packageType: z.enum(["EDU", "BP"]),
  sponsorRef: z.string().optional(),
  leg: z.enum(["L", "R"]).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  let sponsorId: string | undefined;
  if (parsed.data.sponsorRef) {
    const memberCode = decodeMemberRef(parsed.data.sponsorRef);
    if (memberCode) {
      const sponsor = await prisma.user.findUnique({ where: { memberCode } });
      sponsorId = sponsor?.id;
    }
  }

  const settings = await getCompensationSettings();
  const packageType = parsed.data.packageType as PackageType;
  const amount =
    packageType === PackageType.BP ? settings.bpPackageFee : settings.eduPackageFee;

  const passwordHash = await hashPassword(parsed.data.password);
  let memberCode = generateMemberCode();
  while (await prisma.user.findUnique({ where: { memberCode } })) {
    memberCode = generateMemberCode();
  }

  const user = await prisma.user.create({
    data: {
      memberCode,
      email,
      name: parsed.data.name,
      phone: parsed.data.phone,
      passwordHash,
      packageType,
      sponsorId,
      placementLeg:
        parsed.data.leg === "L"
          ? PlacementLeg.LEFT
          : parsed.data.leg === "R"
            ? PlacementLeg.RIGHT
            : PlacementLeg.AUTO,
    },
  });

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: user.id,
      packageType,
      amount,
    },
  });

  if (packageType === PackageType.BP) {
    await processEnrollmentCommissions(enrollment.id);
  }

  await createSession(user.id);

  return NextResponse.json({
    ok: true,
    memberCode,
    redirect: "/dashboard",
  });
}
