import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, PageHeader, Panel } from "@/components/dashboard/ui";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ pkg: string }> };

export default async function PreviewCoursesPage({ params }: Props) {
  const { pkg } = await params;
  if (pkg !== "edu" && pkg !== "bp") notFound();

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <PageHeader
        titleHi="कोर्स / शिक्षा"
        titleEn="Courses preview"
        description="Published LMS modules. Private lesson videos login + paid package ke baad dashboard player mein khulte hain."
      />
      <Panel>
        {courses.length === 0 ? (
          <EmptyState>No published courses yet.</EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const lessons = resolveCurriculum(course).lessons;
              const bpOnly = course.packageGate === "BP";
              const locked = bpOnly && pkg === "edu";
              return (
                <article
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b1a]">
                    {course.category}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[#001a40]">{course.titleHi}</h2>
                  <p className="text-sm text-slate-500">{course.titleEn}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {lessons.length} lessons
                    {bpOnly ? " · BP gate" : " · Edu + BP"}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {lessons.slice(0, 4).map((l) => (
                      <li key={l.id} className="flex justify-between gap-2 border-b border-slate-50 py-1">
                        <span>{l.titleHi}</span>
                        <span className="shrink-0 text-slate-400">{l.durationMin}m</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    {locked ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                        BP package required
                      </span>
                    ) : (
                      <Link
                        href="/signup"
                        className="inline-flex rounded-full bg-[#001a40] px-4 py-2 text-xs font-semibold text-white"
                      >
                        Sign up to watch lessons
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
