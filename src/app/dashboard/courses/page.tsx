import Link from "next/link";
import { EmptyState, PageHeader, Panel } from "@/components/dashboard/ui";
import { getCurrentUser } from "@/lib/auth";
import { canAccessCourse } from "@/lib/course-access";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function DashboardCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  const progressRows = await prisma.courseProgress.findMany({ where: { userId: user.id } });
  const progressMap = new Map(progressRows.map((p) => [p.courseId, p.percent]));

  return (
    <div>
      <PageHeader
        titleHi="कोर्स / शिक्षा"
        titleEn="Courses & Education"
        description="School curriculum, competitive prep, and trading modules based on your package."
      />

      <Panel>
        {courses.length === 0 ? (
          <EmptyState>No published courses yet.</EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const locked = !canAccessCourse(user, course.packageGate);
              const pct = progressMap.get(course.id) ?? 0;
              const lessonCount = resolveCurriculum(course).lessons.length;
              const cta = pct > 0 ? "Continue learning" : "Start learning";

              return (
                <div
                  key={course.id}
                  className={cn(
                    "flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
                    locked && "opacity-70",
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7b1a]">
                    {course.category}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[#001a40]">{course.titleHi}</h2>
                  <p className="text-sm text-slate-500">{course.titleEn}</p>
                  {(course.descriptionEn || course.descriptionHi) && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {course.descriptionHi || course.descriptionEn}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {lessonCount} lessons · {pct}% complete
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#22c55e]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-auto pt-4">
                    {locked ? (
                      <p className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                        Requires BP package
                      </p>
                    ) : (
                      <Link
                        href={`/dashboard/courses/${course.slug}`}
                        className="inline-flex rounded-full bg-[#001a40] px-4 py-2 text-xs font-semibold text-white hover:bg-[#002b5c]"
                      >
                        {cta}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
