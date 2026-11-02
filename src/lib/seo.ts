import type { Metadata } from "next";

export const siteConfig = {
  name: "Sri Magicale",
  shortName: "Sri Magicale",
  legalName: "Sri Magicale — SM Groups",
  tagline: "Education & Youth Empowerment",
  description:
    "Sri Magicale by SM Groups — affordable digital education for Classes 8–12, competitive exam prep, trading skills, and transparent Business Purpose (BP) compensation for youth empowerment across India.",
  descriptionHi:
    "श्री मैजिकेल (SM Groups) — कक्षा 8–12 डिजिटल शिक्षा, प्रतियोगी परीक्षा तैयारी, ट्रेडिंग कौशल और पारदर्शी BP आय मॉडल के साथ युवा सशक्तिकरण।",
  url: (process.env.NEXT_PUBLIC_APP_URL || "https://sm.amrdev.in").replace(/\/$/, ""),
  locale: "hi_IN",
  localeAlternate: "en_IN",
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
  keywords: [
    "Sri Magicale",
    "SM Groups",
    "digital education India",
    "Class 8 to 12 online courses",
    "competitive exam preparation",
    "Edu package",
    "Business Purpose BP",
    "MLM education India",
    "youth empowerment",
    "trading courses India",
    "Stock Forex training",
    "scholarship education NGO",
    "श्री मैजिकेल",
    "डिजिटल शिक्षा",
    "प्रतियोगी परीक्षा",
  ],
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@srimagicale.in",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  sameAs: [
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_YOUTUBE_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
  ].filter(Boolean) as string[],
} as const;

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/mission", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/courses", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/signup", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/login", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/preview/edu", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/preview/bp", changeFrequency: "monthly" as const, priority: 0.5 },
];

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  type?: "website" | "article";
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
  image,
  type = "website",
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const ogImage = image ? absoluteUrl(image) : absoluteUrl("/opengraph-image");
  const keywordList = [...new Set([...siteConfig.keywords, ...keywords])];

  return {
    // absolute avoids double "| Sri Magicale" from root title.template
    title: { absolute: fullTitle },
    description,
    keywords: keywordList,
    applicationName: siteConfig.name,
    authors: [{ name: "SM Groups", url: siteConfig.url }],
    creator: "SM Groups",
    publisher: "SM Groups",
    category: "Education",
    alternates: {
      canonical: url,
      languages: {
        "hi-IN": url,
        "en-IN": url,
        "x-default": url,
      },
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      alternateLocale: [siteConfig.localeAlternate],
      url,
      siteName: siteConfig.legalName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle
        ? { creator: siteConfig.twitterHandle, site: siteConfig.twitterHandle }
        : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/icon"),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    ...(siteConfig.contactPhone ? { telephone: siteConfig.contactPhone } : {}),
    foundingOrganization: {
      "@type": "Organization",
      name: "SM Groups",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsLanguage: ["hi", "en"],
    sameAs: siteConfig.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contactEmail,
        availableLanguage: ["Hindi", "English"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["hi-IN", "en-IN"],
    publisher: {
      "@type": "Organization",
      name: "SM Groups",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/courses?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function courseListJsonLd(
  courses: { name: string; description: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sri Magicale Courses",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.name,
        description: course.description,
        url: course.url,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          sameAs: siteConfig.url,
        },
      },
    })),
  };
}
