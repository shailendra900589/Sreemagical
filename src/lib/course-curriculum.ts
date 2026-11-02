import type { Course } from "@prisma/client";
import { getCourseCurriculum, type CourseCurriculum, type CourseLesson } from "./course-content";
import { extractYouTubeId } from "./youtube";

export function parseLessonsJson(raw: string | null | undefined): CourseLesson[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CourseLesson[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l.id === "string" && typeof l.titleHi === "string")
      .map((l) => ({
        id: l.id,
        titleHi: l.titleHi,
        titleEn: typeof l.titleEn === "string" ? l.titleEn : l.titleHi,
        durationMin: Number(l.durationMin) > 0 ? Number(l.durationMin) : 10,
        summary: typeof l.summary === "string" ? l.summary : "",
        youtubeId: extractYouTubeId(l.youtubeId ?? null),
      }));
  } catch {
    return [];
  }
}

export function resolveCurriculum(course: Pick<Course, "slug" | "titleHi" | "titleEn" | "descriptionHi" | "descriptionEn" | "lessonsJson">): CourseCurriculum {
  const fromDb = parseLessonsJson(course.lessonsJson);
  if (fromDb.length > 0) {
    return {
      slug: course.slug,
      introHi: course.descriptionHi || course.titleHi,
      introEn: course.descriptionEn || course.titleEn,
      lessons: fromDb,
    };
  }

  const staticCurriculum = getCourseCurriculum(course.slug);
  if (staticCurriculum) {
    return {
      ...staticCurriculum,
      introHi: course.descriptionHi || staticCurriculum.introHi,
      introEn: course.descriptionEn || staticCurriculum.introEn,
    };
  }

  return {
    slug: course.slug,
    introHi: course.descriptionHi || course.titleHi,
    introEn: course.descriptionEn || course.titleEn,
    lessons: [
      {
        id: `${course.slug}-intro`,
        titleHi: "परिचय पाठ",
        titleEn: "Introduction lesson",
        durationMin: 10,
        summary: course.descriptionEn || course.titleEn,
      },
    ],
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
