"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";
import {
  WIDGET_SYMBOLS,
  groupWidgetSymbols,
  widgetEmbedUrl,
} from "@/lib/trading-symbols";

type Props = {
  symbol?: string;
  height?: number;
};

export function TradingViewLive({
  symbol: initialSymbol = "BINANCE:BTCUSDT",
  height = 560,
}: Props) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState(0);
  const embedUrl = useMemo(() => widgetEmbedUrl(symbol), [symbol]);
  const groups = useMemo(() => groupWidgetSymbols(), []);
  const active = WIDGET_SYMBOLS.find((s) => s.id === symbol);

  useEffect(() => {
    setLoaded(false);
  }, [symbol, key]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0b1220] shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Live widget feed
            </p>
            <span className="truncate text-[11px] text-white/40">
              {symbol}
              {active?.hint ? ` · ${active.hint}` : ""}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="max-w-[240px] rounded-lg border border-white/15 bg-[#121a2b] px-2 py-1.5 text-xs text-white outline-none"
              aria-label="Chart symbol"
            >
              {groups.map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                      {s.hint ? ` (${s.hint})` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setKey((k) => k + 1)}
              className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/5"
            >
              Reload
            </button>
          </div>
        </div>

        <div className="relative w-full bg-[#0b1220]" style={{ height }}>
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-sm text-white/65">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
              Loading chart…
            </div>
          )}
          <iframe
            key={`${symbol}-${key}`}
            title={`Live chart ${symbol}`}
            src={embedUrl}
            className="h-full w-full border-0"
            allow="clipboard-write; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
          />
        </div>

        <div className="flex gap-2 border-t border-white/10 px-4 py-2.5 text-[11px] leading-5 text-white/50">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d4af37]" />
          <p>
            Live practice chart — crypto, forex, US stocks aur BSE Sensex. Symbol dropdown se
            change karein.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TradingViewTicker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    el.appendChild(widget);

    const script = document.createElement("script");
    script.src =
      "https://s.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    // Only widget-safe symbols (no NSE / TVC India indices)
    script.text = JSON.stringify({
      symbols: [
        { proName: "BINANCE:BTCUSDT", title: "BTC/USDT" },
        { proName: "BINANCE:ETHUSDT", title: "ETH/USDT" },
        { proName: "FX_IDC:USDINR", title: "USD/INR" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "NASDAQ:AAPL", title: "AAPL" },
        { proName: "NASDAQ:TSLA", title: "TSLA" },
        { proName: "TVC:GOLD", title: "GOLD" },
        { proName: "BSE:SENSEX", title: "SENSEX" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-[#0b1220]">
      <div className="tradingview-widget-container min-h-[46px]" ref={ref} />
    </div>
  );
}
