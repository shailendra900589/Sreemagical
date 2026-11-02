"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Front-end acknowledgement for now (wire to CRM/email later)
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
    e.currentTarget.reset();
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-900">संदेश प्राप्त हो गया</p>
        <p className="mt-2 text-sm text-emerald-800">
          Thank you. Our SM Groups team will respond shortly on your email.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-semibold text-[#001a40] underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="नाम / Name" name="name" placeholder="Your full name" required />
        <Field label="फ़ोन / Phone" name="phone" placeholder="+91 XXXXX XXXXX" />
      </div>
      <Field label="ईमेल / Email" name="email" type="email" placeholder="you@example.com" required />
      <Field label="विषय / Subject" name="subject" placeholder="Course enquiry / BP support" />
      <div>
        <label className="text-sm font-medium text-slate-700">संदेश / Message</label>
        <textarea
          name="message"
          required
          className="mt-1 min-h-32 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-[#d4af37] focus:ring-2"
          placeholder="How can we help you?"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#001a40] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002b5c] disabled:opacity-60"
      >
        {loading ? "Sending..." : "संदेश भेजें · Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-[#d4af37] focus:ring-2"
      />
    </div>
  );
}
