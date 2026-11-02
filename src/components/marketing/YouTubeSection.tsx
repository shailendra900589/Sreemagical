const videos = [
  { title: "कक्षा 8–12 गणित तैयारी", tag: "School", tone: "from-slate-800 to-[#001a40]" },
  { title: "ट्रेडिंग बेसिक सीखें", tag: "Trading", tone: "from-[#0b1220] to-[#123050]" },
  { title: "Live Classes — SM Faculty", tag: "Live", tone: "from-[#2a1a0a] to-[#001a40]" },
  { title: "Competitive Exam Strategy", tag: "Exam", tone: "from-[#102a1a] to-[#001a40]" },
];

export function YouTubeSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">Learn free</p>
          <h2 className="mt-2 text-3xl font-bold text-[#001a40]">YouTube से सीखें</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sample learning playlists — full modules unlock after joining Edu / BP.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <div
              key={v.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                className={`flex aspect-video items-center justify-center bg-gradient-to-br ${v.tone}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white shadow-lg">
                  ▶
                </div>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9a7b1a]">
                  {v.tag}
                </p>
                <p className="mt-1 text-sm font-medium text-[#001a40]">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
