import Link from "next/link";
import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeatureStrip } from "@/components/marketing/FeatureStrip";
import { LevelIncomeTable } from "@/components/marketing/LevelIncomeTable";
import { YouTubeSection } from "@/components/marketing/YouTubeSection";
import { TradingViewSection } from "@/components/marketing/TradingViewSection";
import { HomeCtaBand, HowItWorks, IncomeOverview } from "@/components/marketing/HomeExtras";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline} — SM Groups`,
  description: siteConfig.description,
  path: "/",
  keywords: ["home", "youth empowerment India", "SM Groups education platform"],
});

export default function HomePage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: "/" }])}
      />
      <HeroSection />
      <FeatureStrip />
      <HowItWorks />
      <IncomeOverview />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <LevelIncomeTable />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">
              About the mission
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#001a40]">SM Groups · Sri Magicale</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              SM Groups India के युवाओं को affordable digital education, competitive exam readiness,
              और vocational trading skills के माध्यम से आत्मनिर्भर बनाने के लिए committed है।
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sri Magicale एक transparent charity-oriented framework पर चलता है — जहाँ generated
              revenue scholarships, platform infrastructure, और nationwide skill seminars को
              sustain करता है।
            </p>
            <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <strong className="text-[#001a40]">Edu (₹5,000):</strong> Learning only — referral /
                level / royalty नहीं।
              </p>
              <p>
                <strong className="text-[#001a40]">BP (₹10,000):</strong> Edu + trading + full
                affiliate compensation.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-semibold text-[#001a40] underline-offset-4 hover:underline"
            >
              हमारे बारे में और पढ़ें →
            </Link>
          </div>
        </div>
      </section>

      <YouTubeSection />
      <TradingViewSection />
      <HomeCtaBand />
    </div>
  );
}
