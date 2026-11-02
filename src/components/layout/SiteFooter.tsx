import Link from "next/link";
import { siteConfig } from "@/lib/seo";

const explore = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About SM Groups" },
  { href: "/mission", label: "Mission & Vision" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" },
];

const account = [
  { href: "/signup", label: "Join now" },
  { href: "/login", label: "Member login" },
  { href: "/preview/edu", label: "Edu dashboard preview" },
  { href: "/preview/bp", label: "BP dashboard preview" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#001018] text-white" role="contentinfo">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-[#d4af37]">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-white/55">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
            SM Groups द्वारा संचालित charity-oriented platform — affordable digital education,
            competitive exam readiness, और professional trading skills के साथ youth welfare पर
            focus.
          </p>
          <p className="mt-4 text-xs text-white/45">
            Support:{" "}
            <a className="underline hover:text-[#d4af37]" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>
        <nav aria-label="Footer explore">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/90">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#d4af37]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <nav aria-label="Footer account">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/90">Get started</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {account.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#d4af37]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/90">Packages</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Education (Edu) — ₹5,000</li>
            <li>Business Purpose (BP) — ₹10,000</li>
            <li>10-level + royalty income (BP)</li>
            <li>LMS · TradingView practice</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} {siteConfig.name} · Operated by SM Groups · Charity & Youth Welfare Model
      </div>
    </footer>
  );
}
