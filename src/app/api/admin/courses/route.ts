import { PackageType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";
import { extractYouTubeId } from "@/lib/youtube";

const lessonSchema = z.object({
  id: z.string().min(1),
  titleHi: z.string().min(1),
  titleEn: z.string().min(1),
  durationMin: z.number().int().min(1).max(300),
  summary: z.string().min(1),
  /** Accept private/unlisted YouTube URL or bare 11-char ID — stored as ID only */
  youtubeId: z.string().max(220).nullable().optional(),
});

function normalizeLessons(
  lessons: z.infer<typeof lessonSchema>[],
): Array<{
  id: string;
  titleHi: string;
  titleEn: string;
  durationMin: number;
  summary: string;
  youtubeId: string | null;
}> {
  return lessons.map((l) => ({
    id: l.id,
    titleHi: l.titleHi,
    titleEn: l.titleEn,
    durationMin: l.durationMin,
    summary: l.summary,
    youtubeId: extractYouTubeId(l.youtubeId ?? null),
  }));
}

const upsertSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2).max(80).optional(),
  titleHi: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionHi: z.string().optional(),
  descriptionEn: z.string().optional(),
  category: z.string().min(2),
  packageGate: z.enum(["EDU", "BP"]).nullable().optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isPublished: z.boolean().optional(),
  lessons: z.array(lessonSchema).optional(),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courses = await prisma.course.findMany({ orderBy: [{ sortOrder: "asc" }, { titleEn: "asc" }] });
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = upsertSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  let slug = (data.slug?.trim() || slugify(data.titleEn) || slugify(data.titleHi) || `course-${Date.now()}`).toLowerCase();
  const exists = await prisma.course.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const lessons = normalizeLessons(
    data.lessons?.length
      ? data.lessons
      : [
          {
            id: `${slug}-1`,
            titleHi: "परिचय",
            titleEn: "Introduction",
            durationMin: 10,
            summary: data.descriptionEn || data.titleEn,
            youtubeId: null,
          },
        ],
  );

  const course = await prisma.course.create({
    data: {
      slug,
      titleHi: data.titleHi,
      titleEn: data.titleEn,
      descriptionHi: data.descriptionHi ?? "",
      descriptionEn: data.descriptionEn ?? "",
      category: data.category,
      packageGate: (data.packageGate as PackageType | null | undefined) ?? null,
      sortOrder: data.sortOrder ?? 0,
      isPublished: data.isPublished ?? true,
      lessonsJson: JSON.stringify(lessons),
    },
  });

  return NextResponse.json({ ok: true, course });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = upsertSchema.extend({ id: z.string().min(1) }).safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const existing = await prisma.course.findUnique({ where: { id: data.id } });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  let slug = data.slug?.trim().toLowerCase() || existing.slug;
  if (slug !== existing.slug) {
    const clash = await prisma.course.findUnique({ where: { slug } });
    if (clash) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const course = await prisma.course.update({
    where: { id: data.id },
    data: {
      slug,
      titleHi: data.titleHi,
      titleEn: data.titleEn,
      descriptionHi: data.descriptionHi ?? existing.descriptionHi,
      descriptionEn: data.descriptionEn ?? existing.descriptionEn,
      category: data.category,
      packageGate:
        data.packageGate === undefined
          ? existing.packageGate
          : (data.packageGate as PackageType | null),
      sortOrder: data.sortOrder ?? existing.sortOrder,
      isPublished: data.isPublished ?? existing.isPublished,
      ...(data.lessons ? { lessonsJson: JSON.stringify(normalizeLessons(data.lessons)) } : {}),
    },
  });

  return NextResponse.json({ ok: true, course });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
