import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CourseLearner } from "@/components/dashboard/CourseLearner";
import { getCurrentUser } from "@/lib/auth";
import { canAccessCourse } from "@/lib/course-access";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseLearnPage({ params }: Props) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/courses/" + slug);

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course || !course.isPublished) notFound();

  const curriculum = resolveCurriculum(course);

  if (!canAccessCourse(user, course.packageGate)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <h1 className="text-xl font-semibold text-amber-950">{course.titleHi}</h1>
        <p className="mt-2 text-sm text-amber-800">
          This module requires the Business Purpose (BP) package.
        </p>
        <Link
          href="/dashboard/courses"
          className="mt-5 inline-flex rounded-full bg-[#001a40] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const progress = await prisma.courseProgress.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  // Paid access = enrolled package (Edu or BP). Video never shown as public YouTube link.
  const unlocked = user.packageType === "EDU" || user.packageType === "BP";

  return (
    <CourseLearner
      courseSlug={course.slug}
      titleHi={course.titleHi}
      titleEn={course.titleEn}
      category={course.category}
      curriculum={curriculum}
      initialPercent={progress?.percent ?? 0}
      unlocked={unlocked}
    />
  );
}
