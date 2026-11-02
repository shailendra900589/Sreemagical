import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { CtaButton, PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Contact Sri Magicale / SM Groups for Edu enrollment, BP package queries, partnerships, and support. We respond in Hindi and English.",
  path: "/contact",
  keywords: ["contact SM Groups", "Sri Magicale support", "education enquiry India"],
});

export default function ContactPage() {
  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Sri Magicale",
            url: `${siteConfig.url}/contact`,
            description:
              "Contact SM Groups for education packages, BP business queries, and support.",
          },
        ]}
      />
      <PageHero
        eyebrow="Contact · SM Groups"
        title="संपर्क करें"
        subtitle="कोर्स, पैकेज, या BP business से जुड़े सवालों के लिए हमें लिखें। हमारी टीम आपकी मदद के लिए उपलब्ध है।"
        actions={
          <>
            <CtaButton href="/signup">जॉइन करें</CtaButton>
            <CtaButton href="/courses" variant="outline">
              कोर्स देखें
            </CtaButton>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#001a40]">Get in touch</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Edu enrollment, BP compensation queries, या partnership — नीचे फ़ॉर्म भरें या दिए गए
                चैनल्स पर संपर्क करें।
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-[#001a40]">Email</p>
                    <p className="text-slate-600">support@srimagicale.in</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-[#001a40]">Phone / WhatsApp</p>
                    <p className="text-slate-600">+91 98765 43210</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#001a40]/5 text-[#9a7b1a]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-[#001a40]">Office</p>
                    <p className="text-slate-600">SM Groups · India (operations across regions)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[#001a40] p-6 text-white">
              <p className="text-sm text-[#d4af37]">Support hours</p>
              <p className="mt-2 text-lg font-semibold">Mon–Sat · 10:00 AM – 6:00 PM IST</p>
              <p className="mt-2 text-sm text-white/70">
                Dashboard / income related queries: login ke baad wallet section check karein, ya
                admin se contact karein.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
