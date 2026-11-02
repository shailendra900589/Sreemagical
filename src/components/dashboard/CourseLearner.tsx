"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, ShieldCheck } from "lucide-react";
import type { CourseCurriculum } from "@/lib/course-content";
import { SecureLessonPlayer } from "@/components/dashboard/SecureLessonPlayer";
import { cn } from "@/lib/utils";

export function CourseLearner({
  courseSlug,
  titleHi,
  titleEn,
  category,
  curriculum,
  initialPercent,
  unlocked,
}: {
  courseSlug: string;
  titleHi: string;
  titleEn: string;
  category: string;
  curriculum: CourseCurriculum;
  initialPercent: number;
  /** true only after paid Edu/BP package enrollment */
  unlocked: boolean;
}) {
  const initialCompleted = useMemo(() => {
    const count = Math.round((initialPercent / 100) * curriculum.lessons.length);
    return curriculum.lessons.slice(0, count).map((l) => l.id);
  }, [curriculum.lessons, initialPercent]);

  const [activeId, setActiveId] = useState(curriculum.lessons[0]?.id ?? "");
  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [percent, setPercent] = useState(initialPercent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const active = curriculum.lessons.find((l) => l.id === activeId) ?? curriculum.lessons[0];

  async function markComplete() {
    if (!unlocked || !active || completed.includes(active.id)) return;
    setSaving(true);
    setMessage(null);
    const nextCompleted = [...completed, active.id];
    const res = await fetch("/api/courses/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug,
        lessonId: active.id,
        completedLessonIds: completed,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not save progress");
      return;
    }
    setCompleted(data.completedLessonIds ?? nextCompleted);
    setPercent(data.percent ?? percent);
    setMessage("Progress saved");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#001a40]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>
        <div className="text-right">
          <p className="text-xs text-slate-500">Course progress</p>
          <p className="text-sm font-semibold text-[#9a7b1a]">{percent}% complete</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#001a40] to-[#002b5c] px-5 py-5 text-white md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4af37]">
              {category}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
              <ShieldCheck className="h-3 w-3 text-[#d4af37]" />
              Private videos · Dashboard only
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold">{titleHi}</h1>
          <p className="mt-1 text-sm text-white/70">{titleEn}</p>
          <p className="mt-3 max-w-3xl text-sm text-white/80">{curriculum.introHi}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#22c55e] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-slate-100 lg:border-b-0 lg:border-r">
            <p className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Lessons
            </p>
            <ul className="space-y-1 px-2 pb-3">
              {curriculum.lessons.map((lesson, index) => {
                const done = completed.includes(lesson.id);
                const selected = lesson.id === active?.id;
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(lesson.id)}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        selected ? "bg-[#001a40] text-white" : "text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      {done ? (
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            selected ? "text-[#d4af37]" : "text-emerald-600",
                          )}
                        />
                      ) : (
                        <Circle
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            selected ? "text-white/50" : "text-slate-300",
                          )}
                        />
                      )}
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-[11px]",
                            selected ? "text-white/55" : "text-slate-400",
                          )}
                        >
                          Lesson {index + 1} · {lesson.durationMin} min
                          {lesson.youtubeId ? " · Video" : ""}
                        </span>
                        <span className="block font-medium leading-snug">{lesson.titleHi}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="p-5 md:p-6">
            {active ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{active.titleEn}</p>
                    <h2 className="text-xl font-semibold text-[#001a40]">{active.titleHi}</h2>
                    <p className="mt-1 text-sm text-slate-500">{active.durationMin} minutes</p>
                  </div>
                </div>

                <div className="mt-5">
                  <SecureLessonPlayer
                    youtubeId={active.youtubeId}
                    title={active.titleHi}
                    unlocked={unlocked}
                  />
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  <p>{active.summary}</p>
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
                    <li>Video dashboard ke andar hi play hogi — YouTube pe redirect nahi</li>
                    <li>Public YouTube link member UI mein show nahi hoti</li>
                    <li>Dekhne ke baad “Mark lesson complete” dabayein</li>
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={!unlocked || saving || completed.includes(active.id)}
                    onClick={markComplete}
                    className="rounded-full bg-[#001a40] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002b5c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {completed.includes(active.id)
                      ? "Lesson completed"
                      : saving
                        ? "Saving..."
                        : "Mark lesson complete"}
                  </button>
                  {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
