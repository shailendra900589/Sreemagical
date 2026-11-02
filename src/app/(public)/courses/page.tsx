import Link from "next/link";
import type { Metadata } from "next";
import { BookMarked, Lock, Sparkles } from "lucide-react";
import { CtaButton, PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { resolveCurriculum } from "@/lib/course-curriculum";
import { prisma } from "@/lib/prisma";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  courseListJsonLd,
  createMetadata,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Courses & LMS",
  description:
    "Sri Magicale digital courses — Class 8–12 curriculum, competitive exam prep, and BP trading modules (Stock, Forex, technical & fundamental analysis).",
  path: "/courses",
  keywords: [
    "online courses India",
    "LMS education",
    "competitive exam courses",
    "trading courses",
    "Class 8 12 digital curriculum",
  ],
});

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
          ]),
          courseListJsonLd(
            courses.map((c) => ({
              name: c.titleEn || c.titleHi,
              description: c.descriptionEn || c.descriptionHi || c.titleEn,
              url: absoluteUrl(`/courses#${c.slug}`),
            })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Courses · LMS"
        title="कोर्स · Digital Learning Paths"
        subtitle="Edu और BP packages में शामिल structured modules — school curriculum से लेकर trading education तक।"
        actions={
          <>
            <CtaButton href="/signup">कोर्स एक्सेस पाएँ</CtaButton>
            <CtaButton href="/login" variant="outline">
              Member login
            </CtaButton>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Edu included",
              text: "School + competitive modules available on Education package.",
            },
            {
              title: "BP unlocks trading",
              text: "Stock, Forex, technical & fundamental analysis for BP members.",
            },
            {
              title: "Progress tracking",
              text: "Dashboard learner marks lessons complete and updates progress.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-[#001a40]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#001a40]">Available modules</h2>
            <p className="mt-1 text-sm text-slate-500">Join ke baad dashboard se lessons start karein</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {courses.map((c) => {
            const curriculum = resolveCurriculum(c);
            const isBp = c.packageGate === "BP";
            return (
              <article
                key={c.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7b1a]">
                      {c.category}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-[#001a40]">{c.titleHi}</h3>
                    <p className="text-sm text-slate-500">{c.titleEn}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
                    {isBp ? <Lock className="h-4 w-4" /> : <BookMarked className="h-4 w-4" />}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{curriculum.introHi}</p>

                <ul className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  {curriculum.lessons.slice(0, 3).map((lesson) => (
                    <li key={lesson.id} className="flex gap-2">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d4af37]" />
                      <span>
                        {lesson.titleHi}
                        <span className="text-slate-400"> · {lesson.durationMin} min</span>
                      </span>
                    </li>
                  ))}
                  {curriculum.lessons.length > 3 ? (
                    <li className="text-xs text-slate-400">
                      +{curriculum.lessons.length - 3} more lessons inside dashboard
                    </li>
                  ) : null}
                </ul>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isBp
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {isBp ? "Requires BP package" : "Included in Edu & BP"}
                  </span>
                  <Link
                    href={isBp ? "/signup?package=BP" : "/signup?package=EDU"}
                    className="inline-flex h-9 min-w-[7.5rem] items-center justify-center rounded-full bg-[#001a40] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#002b5c]"
                  >
                    Enroll to learn
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
