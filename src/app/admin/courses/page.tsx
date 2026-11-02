import { CoursesManager } from "@/components/admin/CoursesManager";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ sortOrder: "asc" }, { titleEn: "asc" }],
  });

  const initial = courses.map((c) => {
    const resolved = resolveCurriculum(c);
    const hasDbLessons = c.lessonsJson && c.lessonsJson !== "[]";
    return {
      ...c,
      descriptionHi: c.descriptionHi || resolved.introHi,
      descriptionEn: c.descriptionEn || resolved.introEn,
      lessonsJson: hasDbLessons ? c.lessonsJson : JSON.stringify(resolved.lessons),
    };
  });

  return (
    <div>
      <PageHeader
        titleHi="Courses"
        titleEn="LMS modules · private YouTube lessons"
        description="Har course ke lessons mein private/unlisted YouTube URL add karein. Members ko sirf paid dashboard player dikhega — public link nahi, YouTube redirect nahi."
      />
      <Panel
        title="Course library"
        subtitle="Create · edit · delete · private video ID per lesson"
      >
        <CoursesManager initial={initial} />
      </Panel>
    </div>
  );
}
