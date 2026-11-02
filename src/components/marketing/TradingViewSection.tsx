import { TradingViewLive, TradingViewTicker } from "./TradingViewLive";

export function TradingViewSection() {
  return (
    <section className="bg-[#f3f5f9] py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">
              BP Trading Lab
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#001a40]">TradingView Practice</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Live embedded chart for crypto, forex, US stocks & BSE Sensex — practice ke liye
              dropdown se symbol change karein.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Widget-safe symbols only
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <TradingViewTicker />
          <TradingViewLive symbol="BINANCE:BTCUSDT" height={560} />
        </div>
      </div>
    </section>
  );
}
