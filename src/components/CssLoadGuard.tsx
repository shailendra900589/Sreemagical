"use client";

import { useEffect } from "react";

const SESSION_KEY = "sm-css-injected";

function tailwindActive(): boolean {
  const probe = document.createElement("div");
  probe.className = "hidden";
  probe.setAttribute("aria-hidden", "true");
  document.body.appendChild(probe);
  const ok = getComputedStyle(probe).display === "none";
  probe.remove();
  return ok;
}

async function injectStylesheetText(href: string): Promise<boolean> {
  const res = await fetch(href, { cache: "reload", credentials: "same-origin" });
  if (!res.ok) return false;
  const text = await res.text();
  if (!text.includes("--background") && !text.includes("@layer")) return false;

  if (document.querySelector(`style[data-sm-css="${href}"]`)) return true;

  const style = document.createElement("style");
  style.setAttribute("data-sm-css", href);
  style.textContent = text;
  document.head.appendChild(style);
  return tailwindActive();
}

async function recoverStyles(): Promise<void> {
  if (tailwindActive()) {
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }

  const linkHrefs = [...document.querySelectorAll('link[rel="stylesheet"]')]
    .map((el) => (el as HTMLLinkElement).href)
    .filter(Boolean);

  for (const href of linkHrefs) {
    try {
      if (await injectStylesheetText(href)) return;
    } catch {
      /* try next */
    }
  }

  try {
    const manifest = (await fetch("/asset-manifest.json", { cache: "reload" }).then((r) =>
      r.json(),
    )) as { css?: string };
    if (manifest.css) {
      const url = new URL(manifest.css, window.location.origin).href;
      if (await injectStylesheetText(url)) return;
    }
  } catch {
    /* ignore */
  }

  if (sessionStorage.getItem(SESSION_KEY)) return;
  sessionStorage.setItem(SESSION_KEY, "1");

  const url = new URL(window.location.href);
  url.searchParams.set("_cssfix", String(Date.now()));
  window.location.replace(url.toString());
}

export function CssLoadGuard() {
  useEffect(() => {
    void recoverStyles();
  }, []);

  return null;
}
