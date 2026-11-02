/**
 * TradingView free widgets only allow exchanges listed in:
 * https://www.tradingview.com/widget-docs/markets/
 *
 * NSE India is NOT licensed for free embeds → "This symbol is only available on TradingView"
 * / "No symbols match your criteria". Crypto + Forex are real-time; BSE is EOD in widgets.
 */

export type ChartSymbol = {
  id: string;
  label: string;
  group: "Crypto" | "Forex" | "US Stocks" | "Commodities" | "India (widget)";
  hint?: string;
};

/** Symbols that load inside free TradingView embeds */
export const WIDGET_SYMBOLS: ChartSymbol[] = [
  { id: "BINANCE:BTCUSDT", label: "BTC / USDT", group: "Crypto", hint: "24×7 live" },
  { id: "BINANCE:ETHUSDT", label: "ETH / USDT", group: "Crypto", hint: "24×7 live" },
  { id: "BINANCE:SOLUSDT", label: "SOL / USDT", group: "Crypto", hint: "24×7 live" },
  { id: "FX:EURUSD", label: "EUR / USD", group: "Forex", hint: "Live forex" },
  { id: "FX_IDC:USDINR", label: "USD / INR", group: "Forex", hint: "Live forex" },
  { id: "FX:GBPUSD", label: "GBP / USD", group: "Forex", hint: "Live forex" },
  { id: "NASDAQ:AAPL", label: "Apple (AAPL)", group: "US Stocks", hint: "Delayed OK" },
  { id: "NASDAQ:MSFT", label: "Microsoft (MSFT)", group: "US Stocks", hint: "Delayed OK" },
  { id: "NASDAQ:TSLA", label: "Tesla (TSLA)", group: "US Stocks", hint: "Delayed OK" },
  { id: "TVC:GOLD", label: "Gold", group: "Commodities", hint: "Spot gold" },
  { id: "TVC:USOIL", label: "Crude Oil", group: "Commodities", hint: "WTI" },
  { id: "BSE:SENSEX", label: "BSE SENSEX", group: "India (widget)", hint: "EOD · widget-safe" },
];

export function widgetEmbedUrl(symbol: string) {
  const params = new URLSearchParams({
    frameElementId: "sm_tv_live",
    symbol,
    interval: "15",
    // Prevent in-chart symbol search (users pick NSE → empty/error modal)
    hidesidetoolbar: "0",
    hidetoptoolbar: "0",
    symboledit: "0",
    saveimage: "1",
    toolbarbg: "0B1220",
    studies: '["Volume@tv-basicstudies"]',
    theme: "dark",
    style: "1",
    timezone: "Asia/Kolkata",
    withdateranges: "1",
    showpopupbutton: "1",
    studies_overrides: "{}",
    overrides: "{}",
    enabled_features: "[]",
    disabled_features: '["header_symbol_search","symbol_search_hot_key"]',
    locale: "en",
    utm_source: "srimagicale",
    utm_medium: "widget",
    utm_campaign: "chart",
  });

  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
}

export function groupWidgetSymbols(symbols: ChartSymbol[] = WIDGET_SYMBOLS) {
  const map = new Map<string, ChartSymbol[]>();
  for (const s of symbols) {
    const list = map.get(s.group) ?? [];
    list.push(s);
    map.set(s.group, list);
  }
  return Array.from(map.entries());
}
