import type { Course, PackageType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Matches prisma/seed.ts — used when SQLite is unavailable at runtime (e.g. missing prod.db in standalone). */
export const catalogCourseFallback: Pick<
  Course,
  | "id"
  | "slug"
  | "titleHi"
  | "titleEn"
  | "category"
  | "packageGate"
  | "sortOrder"
  | "descriptionHi"
  | "descriptionEn"
  | "lessonsJson"
  | "isPublished"
>[] = [
  {
    id: "catalog-class-812",
    slug: "class-8-12-curriculum",
    titleHi: "कक्षा 8–12 पाठ्यक्रम",
    titleEn: "Class 8–12 Curriculum",
    category: "school",
    packageGate: "EDU" as PackageType,
    sortOrder: 1,
    descriptionHi: "",
    descriptionEn: "",
    lessonsJson: "[]",
    isPublished: true,
  },
  {
    id: "catalog-competitive",
    slug: "competitive-exam-prep",
    titleHi: "प्रतियोगी परीक्षा तैयारी",
    titleEn: "Competitive Exam Prep",
    category: "school",
    packageGate: "EDU" as PackageType,
    sortOrder: 2,
    descriptionHi: "",
    descriptionEn: "",
    lessonsJson: "[]",
    isPublished: true,
  },
  {
    id: "catalog-trading",
    slug: "trading-education",
    titleHi: "ट्रेडिंग शिक्षा (Stock & Forex)",
    titleEn: "Trading Education",
    category: "trading",
    packageGate: "BP" as PackageType,
    sortOrder: 3,
    descriptionHi: "",
    descriptionEn: "",
    lessonsJson: "[]",
    isPublished: true,
  },
  {
    id: "catalog-ta",
    slug: "technical-analysis",
    titleHi: "टेक्निकल एवं फंडामेंटल विश्लेषण",
    titleEn: "Technical & Fundamental Analysis",
    category: "trading",
    packageGate: "BP" as PackageType,
    sortOrder: 4,
    descriptionHi: "",
    descriptionEn: "",
    lessonsJson: "[]",
    isPublished: true,
  },
];

export async function getPublishedCourses(): Promise<
  Pick<
    Course,
    | "id"
    | "slug"
    | "titleHi"
    | "titleEn"
    | "category"
    | "packageGate"
    | "sortOrder"
    | "descriptionHi"
    | "descriptionEn"
    | "lessonsJson"
  >[]
> {
  try {
    return await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        titleHi: true,
        titleEn: true,
        category: true,
        packageGate: true,
        sortOrder: true,
        descriptionHi: true,
        descriptionEn: true,
        lessonsJson: true,
      },
    });
  } catch (error) {
    console.error("[getPublishedCourses] DB unavailable, using catalog fallback", error);
    return catalogCourseFallback;
  }
}
