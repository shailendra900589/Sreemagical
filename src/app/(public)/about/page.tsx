import Link from "next/link";
import type { Metadata } from "next";
import { Building2, HeartHandshake, Laptop, Target, Users2 } from "lucide-react";
import { CtaButton, PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About SM Groups",
  description:
    "About Sri Magicale and SM Groups — digital education, competitive prep, career trading skills, and charity-oriented youth welfare across India.",
  path: "/about",
  keywords: ["about SM Groups", "Sri Magicale about", "youth welfare NGO education"],
});

const pillars = [
  {
    icon: Laptop,
    title: "Digital Education",
    hi: "डिजिटल शिक्षा",
    text: "Classes 8–12 curriculum, study notes, e-books, and structured LMS pathways for every learner.",
  },
  {
    icon: Target,
    title: "Competitive Edge",
    hi: "प्रतियोगी तैयारी",
    text: "Exam-oriented modules that build confidence for major competitive and entrance assessments.",
  },
  {
    icon: Building2,
    title: "Career Skills",
    hi: "रोज़गार कौशल",
    text: "BP members get Stock, Forex, technical & fundamental market training for livelihood skills.",
  },
  {
    icon: HeartHandshake,
    title: "Youth Welfare",
    hi: "युवा कल्याण",
    text: "Charity-oriented governance — scholarships, seminars, and infrastructure for lasting impact.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About · SM Groups"
        title="हमारे बारे में — Sri Magicale"
        subtitle="SM Groups एक social enterprise है जो भारत के युवाओं को आत्मनिर्भरता, आधुनिक vocational skills, और किफायती digital education के ज़रिए सशक्त बनाता है।"
        actions={
          <>
            <CtaButton href="/signup">जॉइन करें</CtaButton>
            <CtaButton href="/mission" variant="outline">
              मिशन देखें
            </CtaButton>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">Who we are</p>
            <h2 className="mt-2 text-2xl font-bold text-[#001a40]">एक प्लेटफ़ॉर्म, दो उद्देश्य</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              <strong>Sri Magicale</strong> school curricula (Classes 8–12), competitive exam preparation,
              और professional financial market training को एक ही LMS के तहत लाता है। हमारा governance
              model youth welfare और transparency को प्राथमिकता देता है।
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              यह सिर्फ एक course portal नहीं — यह Education + Employment / Earnings का dual pathway है,
              जहाँ Edu members learning पर focus करते हैं, और BP members trading skills के साथ team
              development में भी भाग ले सकते हैं।
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#001a40] p-4 text-white">
                <p className="text-xs text-[#d4af37]">Operated by</p>
                <p className="mt-1 text-lg font-semibold">SM Groups</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Model</p>
                <p className="mt-1 text-lg font-semibold text-[#001a40]">Charity & Youth Welfare</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#001a40] text-[#d4af37]">
              <Users2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#001a40]">Whom we serve</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>• School students (Class 8–12) seeking structured digital learning</li>
              <li>• Aspirants preparing for competitive examinations</li>
              <li>• Youth seeking job-oriented trading & market skills (BP)</li>
              <li>• Communities benefiting from scholarships and skill workshops</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">Pillars</p>
            <h2 className="mt-2 text-3xl font-bold text-[#001a40]">हमारे मुख्य स्तंभ</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, hi, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <Icon className="h-5 w-5 text-[#9a7b1a]" />
                <p className="mt-3 text-xs text-slate-400">{title}</p>
                <h3 className="mt-1 font-semibold text-[#001a40]">{hi}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
          <h2 className="text-2xl font-bold text-[#001a40]">Joining modules</h2>
          <p className="mt-2 text-sm text-slate-600">दो स्पष्ट रास्ते — सीखें, या सीखें + कमाई के अवसर।</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-semibold text-[#9a7b1a]">EDUCATION</p>
              <h3 className="mt-1 text-xl font-semibold text-[#001a40]">Edu · ₹5,000</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Digital curriculum Classes 8–12</li>
                <li>• Competitive exam foundation modules</li>
                <li>• Notes & learning resources</li>
                <li>• No affiliate / level / royalty income</li>
              </ul>
              <Link href="/signup?package=EDU" className="mt-5 inline-block text-sm font-semibold text-[#001a40] underline">
                Edu जॉइन करें
              </Link>
            </div>
            <div className="rounded-xl border border-[#d4af37]/40 bg-[#fffdf5] p-5">
              <p className="text-xs font-semibold text-[#9a7b1a]">BUSINESS PURPOSE</p>
              <h3 className="mt-1 text-xl font-semibold text-[#001a40]">BP · ₹10,000</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• All Edu benefits included</li>
                <li>• Stock, Forex, technical & fundamental training</li>
                <li>• Direct, level & royalty eligibility</li>
                <li>• Mentorship & team development tools</li>
              </ul>
              <Link href="/signup?package=BP" className="mt-5 inline-block text-sm font-semibold text-[#001a40] underline">
                BP जॉइन करें
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
