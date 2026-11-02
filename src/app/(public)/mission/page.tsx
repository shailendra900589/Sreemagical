import type { Metadata } from "next";
import {
  Eye,
  Flag,
  GraduationCap,
  HeartHandshake,
  Server,
  Sparkles,
} from "lucide-react";
import { CtaButton, PageHero } from "@/components/marketing/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Mission & Vision",
  description:
    "Sri Magicale mission and vision — quality education, skill development, scholarships, and transparent NGO-style empowerment for every Indian student and youth.",
  path: "/mission",
  keywords: ["mission", "vision", "education for all", "scholarships India"],
});

export default function MissionPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Mission & Vision", path: "/mission" },
        ])}
      />
      <PageHero
        eyebrow="Mission & Vision"
        title="मिशन व विज़न"
        subtitle="Sri Magicale का उद्देश्य हर छात्र और युवा तक उच्च-गुणवत्ता वाली शिक्षा व कौशल पहुँचाना है — transparent, NGO-style framework के साथ।"
        actions={
          <>
            <CtaButton href="/signup">मिशन से जुड़ें</CtaButton>
            <CtaButton href="/about" variant="outline">
              About SM Groups
            </CtaButton>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#001a40] text-[#d4af37]">
              <Flag className="h-6 w-6" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">Our Mission</p>
            <h2 className="mt-2 text-2xl font-bold text-[#001a40]">हमारा मिशन</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              देशभर के हर छात्र और युवा तक high-caliber school curricula, competitive exam preparation,
              और professional financial market trading courses पहुँचाना — affordable digital format में।
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7b1a]" />
                Structured Class 8–12 learning + exam readiness
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7b1a]" />
                Job-oriented trading education for BP members
              </li>
              <li className="flex gap-2">
                <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7b1a]" />
                Equal access focus for semi-urban & rural youth
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#9a7b1a]">
              <Eye className="h-6 w-6" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">Our Vision</p>
            <h2 className="mt-2 text-2xl font-bold text-[#001a40]">हमारा विज़न</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              Transparent, NGO/charity-oriented framework में संचालित होना — जहाँ generated revenue
              सीधे youth welfare initiatives, scholarships, skill development, और platform infrastructure
              को sustain करे।
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li>• Open and accountable compensation settings (admin-controlled)</li>
              <li>• Sustainable LMS & faculty infrastructure</li>
              <li>• Nationwide workshops for financial literacy & entrepreneurship</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-[#001a40] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
            Social fund allocation
          </p>
          <h2 className="mt-2 text-3xl font-bold">सामाजिक निधि वितरण व गवर्नेंस</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
            हर cycle में platform revenue का हिस्सा youth welfare और system sustainability के लिए
            निर्धारित रहता है।
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: HeartHandshake,
                title: "Youth Welfare & Scholarships",
                hi: "छात्रवृत्ति एवं कल्याण",
                text: "Deserving students के लिए sponsored enrollments और technical support।",
              },
              {
                icon: Server,
                title: "Infrastructure & Servers",
                hi: "इंफ्रास्ट्रक्चर",
                text: "Hosting, high-performance apps, LMS portals, और expert faculty fees।",
              },
              {
                icon: Sparkles,
                title: "Nationwide Skill Seminars",
                hi: "कौशल सेमिनार",
                text: "Financial literacy, career guidance, और entrepreneurship workshops।",
              },
            ].map(({ icon: Icon, title, hi, text }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Icon className="h-5 w-5 text-[#d4af37]" />
                <p className="mt-4 text-xs text-white/50">{title}</p>
                <h3 className="mt-1 text-lg font-semibold">{hi}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:flex md:items-center md:justify-between md:gap-8 md:p-9">
          <div>
            <h2 className="text-2xl font-bold text-[#001a40]">आप भी इस मिशन का हिस्सा बनें</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
              Edu से सीखें, या BP के साथ skills + team development — दोनों रास्ते youth empowerment
              को आगे बढ़ाते हैं।
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
            <CtaButton href="/signup">जॉइन करें</CtaButton>
            <a
              href="/contact"
              className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#001a40] hover:bg-slate-50"
            >
              संपर्क करें
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
