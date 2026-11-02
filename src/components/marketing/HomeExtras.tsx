import Link from "next/link";
import { ArrowRight, BookOpen, Handshake, Layers3, Users } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: BookOpen,
      title: "पैकेज चुनें",
      en: "Choose package",
      text: "Edu (₹5,000) for learning only, or BP (₹10,000) for education + business income.",
    },
    {
      icon: Users,
      title: "जॉइन करें",
      en: "Join & learn",
      text: "Get LMS access for Classes 8–12, competitive prep, and (BP) trading modules.",
    },
    {
      icon: Layers3,
      title: "टीम विकसित करें",
      en: "Grow team (BP)",
      text: "Earn direct sponsor, 10-level distribution, and royalty club income transparently.",
    },
    {
      icon: Handshake,
      title: "समाज में योगदान",
      en: "Social impact",
      text: "Revenue supports scholarships, infra, and skill seminars under SM Groups model.",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7b1a]">How it works</p>
          <h2 className="mt-2 text-3xl font-bold text-[#001a40]">कैसे काम करता है प्लेटफ़ॉर्म?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Clear joining path — education first, optional business income for BP members, with
            admin-controlled compensation percentages.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, en, text }, i) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40] text-[#d4af37]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">0{i + 1}</span>
              </div>
              <p className="mt-4 text-xs text-[#9a7b1a]">{en}</p>
              <h3 className="mt-1 font-semibold text-[#001a40]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IncomeOverview() {
  return (
    <section className="bg-[#f7f8fb] py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7b1a]">
              BP Compensation
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#001a40]">तीन आय स्रोत — स्पष्ट नियम</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              केवल Business Purpose members के लिए। Percentages admin panel से किसी भी समय अपडेट हो
              सकते हैं।
            </p>
          </div>
          <div className="flex flex-wrap gap-2 self-start lg:self-auto">
            <Link
              href="/signup?package=BP"
              className="inline-flex items-center gap-2 rounded-full bg-[#001a40] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002b5c]"
            >
              BP जॉइन करें <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Direct Sponsor",
              hi: "प्रत्यक्ष स्पॉन्सर आय",
              body: "Standard 5% · Offer window 10% on every direct BP joining (₹10,000 base).",
            },
            {
              title: "Level Distribution",
              hi: "10-लेवल वितरण",
              body: "Progressive payouts Level 1–10 (default 5% to 50%) based on upline depth.",
            },
            {
              title: "Royalty Club",
              hi: "रॉयल्टी क्लब",
              body: "10% turnover pool — Silver 5%, Gold 3%, Diamond 2% among qualified members.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9a7b1a]">{card.title}</p>
              <h3 className="mt-1 text-lg font-semibold text-[#001a40]">{card.hi}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCtaBand() {
  return (
    <section className="bg-[#001a40] py-14 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">आज ही Sri Magicale से जुड़ें</h2>
          <p className="mt-2 max-w-xl text-sm text-white/75">
            शिक्षा, कौशल और (BP) business opportunity — transparent digital platform पर।
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/preview/edu"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold"
          >
            Edu dashboard
          </Link>
          <Link
            href="/preview/bp"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold"
          >
            BP dashboard
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#001a40]"
          >
            जॉइन करें
          </Link>
        </div>
      </div>
    </section>
  );
}
