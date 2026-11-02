import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { canAccessCourse } from "@/lib/course-access";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  courseSlug: z.string().min(2),
  lessonId: z.string().min(1),
  completedLessonIds: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.packageType !== "EDU" && user.packageType !== "BP") {
    return NextResponse.json({ error: "Paid package required" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { slug: parsed.data.courseSlug },
  });
  if (!course || !course.isPublished) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  if (!canAccessCourse(user, course.packageGate)) {
    return NextResponse.json({ error: "Package upgrade required" }, { status: 403 });
  }

  const curriculum = resolveCurriculum(course);
  if (!curriculum.lessons.some((l) => l.id === parsed.data.lessonId)) {
    return NextResponse.json({ error: "Invalid lesson" }, { status: 400 });
  }

  const completed = Array.from(
    new Set([...parsed.data.completedLessonIds, parsed.data.lessonId]),
  );
  const lessonCount = curriculum.lessons.length || 1;
  const percent = Math.min(
    100,
    Math.round(
      (curriculum.lessons.filter((l) => completed.includes(l.id)).length / lessonCount) * 100,
    ),
  );

  const progress = await prisma.courseProgress.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    update: { percent },
    create: {
      userId: user.id,
      courseId: course.id,
      percent,
    },
  });

  return NextResponse.json({
    ok: true,
    percent: progress.percent,
    completedLessonIds: completed,
  });
}
