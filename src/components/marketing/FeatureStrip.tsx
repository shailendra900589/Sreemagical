import { Crown, HeartHandshake, Layers } from "lucide-react";

const items = [
  {
    icon: Layers,
    title: "10 Level Payouts",
    hi: "10 स्तर तक वितरण",
    text: "Team expansion पर progressive level income — percentages admin panel से live update।",
  },
  {
    icon: Crown,
    title: "Royalty Club",
    hi: "रॉयल्टी क्लब",
    text: "Silver, Gold, Diamond pools company turnover से — equal share among qualifiers।",
  },
  {
    icon: HeartHandshake,
    title: "Charity & Youth Welfare",
    hi: "यूथ वेलफेयर",
    text: "Scholarships, LMS infrastructure, और nationwide skill seminars।",
  },
];

export function FeatureStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 md:px-6">
        {items.map(({ icon: Icon, title, hi, text }) => (
          <div
            key={title}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#001a40] text-[#d4af37]">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-[#9a7b1a]">{hi}</p>
              <h3 className="font-semibold text-[#001a40]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
