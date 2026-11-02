import Link from "next/link";
import { GraduationCap, LineChart, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#001a40] via-[#002b5c] to-[#001028] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[380px] w-[380px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-6 md:py-20 lg:gap-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" />
            Charity & Youth Welfare Model · SM Groups
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-[3.4rem]">
            <span className="text-[#ffd54f]">शिक्षा भी,</span>
            <br />
            रोज़गार भी!
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/80 md:text-lg">
            श्री मैजिकल — शिक्षा एवं युवा सशक्तिकरण मिशन। Classes 8–12 digital curriculum,
            competitive exam prep, और professional trading education — transparent LMS के साथ।
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#001a40] hover:bg-[#e0c15a]"
            >
              अभी जॉइन करें
            </Link>
            <Link
              href="/courses"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              कोर्स देखें
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: GraduationCap, label: "Edu LMS", value: "Class 8–12" },
              { icon: LineChart, label: "BP Trading", value: "Stock & Forex" },
              { icon: ShieldCheck, label: "Transparency", value: "Admin % control" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Icon className="h-4 w-4 text-[#d4af37]" />
                <p className="mt-2 text-xs text-white/55">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <PackageCard
            title="Education Package"
            titleHi="शिक्षा पैकेज"
            price="₹5,000"
            points={[
              "Classes 8–12 digital curriculum",
              "Competitive exam modules",
              "Notes, e-books & LMS access",
              "No referral / level income",
            ]}
            href="/signup?package=EDU"
            variant="edu"
          />
          <PackageCard
            title="Business Purpose (BP)"
            titleHi="व्यवसाय पैकेज"
            price="₹10,000"
            points={[
              "All Edu benefits + trading courses",
              "Direct sponsor income (5%/10%)",
              "10-level + royalty club eligibility",
              "Team development & mentorship",
            ]}
            href="/signup?package=BP"
            variant="bp"
            featured
          />
        </div>
      </div>
    </section>
  );
}

function PackageCard({
  title,
  titleHi,
  price,
  points,
  href,
  variant,
  featured,
}: {
  title: string;
  titleHi: string;
  price: string;
  points: string[];
  href: string;
  variant: "edu" | "bp";
  featured?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-5 shadow-xl backdrop-blur ${
        featured ? "border-[#d4af37] bg-white/10" : "border-white/15 bg-white/5"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-[#d4af37]">{titleHi}</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{price}</p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-white/80">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-[#d4af37]">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
          variant === "bp"
            ? "bg-[#d4af37] text-[#001a40] hover:bg-[#e0c15a]"
            : "bg-white text-[#001a40] hover:bg-slate-100"
        }`}
      >
        जॉइन करें
      </Link>
    </div>
  );
}
