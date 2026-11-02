"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { CourseLesson } from "@/lib/course-content";
import { parseLessonsJson } from "@/lib/course-curriculum";

type CourseRow = {
  id: string;
  slug: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  category: string;
  packageGate: "EDU" | "BP" | null;
  sortOrder: number;
  isPublished: boolean;
  lessonsJson: string;
};

type FormState = {
  id?: string;
  slug: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  category: string;
  packageGate: "" | "EDU" | "BP";
  sortOrder: number;
  isPublished: boolean;
  lessons: CourseLesson[];
};

const emptyForm = (): FormState => ({
  slug: "",
  titleHi: "",
  titleEn: "",
  descriptionHi: "",
  descriptionEn: "",
  category: "school",
  packageGate: "EDU",
  sortOrder: 0,
  isPublished: true,
  lessons: [
    {
      id: `lesson-${Date.now()}`,
      titleHi: "परिचय पाठ",
      titleEn: "Introduction",
      durationMin: 10,
      summary: "Course introduction and overview.",
      youtubeId: null,
    },
  ],
});

export function CoursesManager({ initial }: { initial: CourseRow[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(form.id);
  const lessonCount = useMemo(() => form.lessons.length, [form.lessons.length]);

  function openCreate() {
    setForm(emptyForm());
    setError(null);
    setMessage(null);
    setOpen(true);
  }

  function openEdit(course: CourseRow) {
    setForm({
      id: course.id,
      slug: course.slug,
      titleHi: course.titleHi,
      titleEn: course.titleEn,
      descriptionHi: course.descriptionHi,
      descriptionEn: course.descriptionEn,
      category: course.category,
      packageGate: course.packageGate ?? "",
      sortOrder: course.sortOrder,
      isPublished: course.isPublished,
      lessons: parseLessonsJson(course.lessonsJson).length
        ? parseLessonsJson(course.lessonsJson)
        : emptyForm().lessons,
    });
    setError(null);
    setMessage(null);
    setOpen(true);
  }

  function updateLesson(index: number, patch: Partial<CourseLesson>) {
    setForm((f) => ({
      ...f,
      lessons: f.lessons.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));
  }

  function addLesson() {
    setForm((f) => ({
      ...f,
      lessons: [
        ...f.lessons,
        {
          id: `lesson-${Date.now()}-${f.lessons.length + 1}`,
          titleHi: `पाठ ${f.lessons.length + 1}`,
          titleEn: `Lesson ${f.lessons.length + 1}`,
          durationMin: 15,
          summary: "Lesson summary",
          youtubeId: null,
        },
      ],
    }));
  }

  function removeLesson(index: number) {
    setForm((f) => ({
      ...f,
      lessons: f.lessons.filter((_, i) => i !== index),
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      id: form.id,
      slug: form.slug || undefined,
      titleHi: form.titleHi,
      titleEn: form.titleEn,
      descriptionHi: form.descriptionHi,
      descriptionEn: form.descriptionEn,
      category: form.category,
      packageGate: form.packageGate === "" ? null : form.packageGate,
      sortOrder: Number(form.sortOrder) || 0,
      isPublished: form.isPublished,
      lessons: form.lessons,
    };

    const res = await fetch("/api/admin/courses", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Save failed");
      return;
    }

    const saved = data.course as CourseRow;
    setCourses((list) => {
      const without = list.filter((c) => c.id !== saved.id);
      return [...without, saved].sort((a, b) => a.sortOrder - b.sortOrder);
    });
    setMessage(editing ? "Course updated successfully." : "Course created successfully.");
    setOpen(false);
    router.refresh();
  }

  async function onDelete(id: string, title: string) {
    if (!confirm(`Delete course “${title}”? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/courses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    setCourses((list) => list.filter((c) => c.id !== id));
    setMessage("Course deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{courses.length} courses in LMS</p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-[#001a40] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#002b5c]"
        >
          <Plus className="h-4 w-4" /> Add course
        </button>
      </div>

      {message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {error && !open && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => {
          const parsedLessons = parseLessonsJson(c.lessonsJson);
          const lessons = parsedLessons.length;
          const withVideo = parsedLessons.filter((l) => l.youtubeId).length;
          return (
            <article
              key={c.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b1a]">
                    {c.category}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[#001a40]">{c.titleHi}</h3>
                  <p className="text-sm text-slate-500">{c.titleEn}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    c.isPublished
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {c.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                {c.descriptionEn || c.descriptionHi || "No description"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Gate: {c.packageGate ?? "ALL"} · {lessons || "default"} lessons · {withVideo} private
                videos · `{c.slug}` · order {c.sortOrder}
              </p>

              <div className="mt-auto flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-[#001a40] hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(c.id, c.titleEn)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={onSubmit}
            className="my-6 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9a7b1a]">
                  {editing ? "Update course" : "Create course"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#001a40]">
                  {editing ? "Edit LMS module" : "Add LMS module"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 p-2 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Field
                label="Title (Hindi)"
                value={form.titleHi}
                onChange={(v) => setForm((f) => ({ ...f, titleHi: v }))}
                required
              />
              <Field
                label="Title (English)"
                value={form.titleEn}
                onChange={(v) => setForm((f) => ({ ...f, titleEn: v }))}
                required
              />
              <Field
                label="Slug (optional)"
                value={form.slug}
                onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
                placeholder="auto from English title"
              />
              <Field
                label="Category"
                value={form.category}
                onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                required
              />
              <label className="block text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Description (Hindi)</span>
                <textarea
                  value={form.descriptionHi}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionHi: e.target.value }))}
                  className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
                />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Description (English)</span>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                  className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Package gate</span>
                <select
                  value={form.packageGate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      packageGate: e.target.value as FormState["packageGate"],
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#d4af37]"
                >
                  <option value="">ALL (Edu + BP)</option>
                  <option value="EDU">EDU</option>
                  <option value="BP">BP only</option>
                </select>
              </label>

              <Field
                label="Sort order"
                type="number"
                value={String(form.sortOrder)}
                onChange={(v) => setForm((f) => ({ ...f, sortOrder: Number(v) || 0 }))}
              />

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                Published (visible to members)
              </label>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#001a40]">Lessons ({lessonCount})</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Har lesson = private/unlisted YouTube video. Member ko sirf dashboard player
                    dikhega — watch link nahi, YouTube redirect nahi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addLesson}
                  className="shrink-0 text-sm font-semibold text-[#001a40] underline"
                >
                  + Add lesson
                </button>
              </div>
              <div className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
                {form.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500">Lesson {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="text-xs text-red-600"
                        disabled={form.lessons.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={lesson.titleHi}
                        onChange={(e) => updateLesson(index, { titleHi: e.target.value })}
                        placeholder="Title Hindi"
                        className="rounded-lg border px-2 py-1.5 text-sm"
                        required
                      />
                      <input
                        value={lesson.titleEn}
                        onChange={(e) => updateLesson(index, { titleEn: e.target.value })}
                        placeholder="Title English"
                        className="rounded-lg border px-2 py-1.5 text-sm"
                        required
                      />
                      <input
                        type="number"
                        min={1}
                        value={lesson.durationMin}
                        onChange={(e) =>
                          updateLesson(index, { durationMin: Number(e.target.value) || 1 })
                        }
                        placeholder="Minutes"
                        className="rounded-lg border px-2 py-1.5 text-sm"
                        required
                      />
                      <input
                        value={lesson.summary}
                        onChange={(e) => updateLesson(index, { summary: e.target.value })}
                        placeholder="Summary"
                        className="rounded-lg border px-2 py-1.5 text-sm"
                        required
                      />
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9a7b1a]">
                          Private YouTube video (URL or ID)
                        </label>
                        <input
                          value={lesson.youtubeId ?? ""}
                          onChange={(e) =>
                            updateLesson(index, {
                              youtubeId: e.target.value.trim() ? e.target.value.trim() : null,
                            })
                          }
                          placeholder="https://youtu.be/xxxxxxxxxxx or video ID"
                          className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/40 px-2 py-1.5 text-sm"
                        />
                        <p className="mt-1 text-[11px] text-slate-500">
                          YouTube pe video Unlisted/Private rakhein. Save pe sirf video ID store
                          hoga; member dashboard mein embed hi dikhega.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#001a40] disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "Update course" : "Create course"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
      />
    </label>
  );
}
