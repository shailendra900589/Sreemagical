"use client";

import { useEffect } from "react";

const SESSION_KEY = "sm-css-recovered";

/**
 * Hostinger/LiteSpeed + long-lived browser cache can leave users with HTML but no
 * applied Tailwind bundle. Detect missing utilities once and hard-reload with cache-bust.
 */
export function CssLoadGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const probe = document.createElement("div");
    probe.className = "hidden";
    probe.setAttribute("aria-hidden", "true");
    document.body.appendChild(probe);
    const tailwindOk = getComputedStyle(probe).display === "none";
    probe.remove();

    if (tailwindOk) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }

    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    const url = new URL(window.location.href);
    url.searchParams.set("_assets", String(Date.now()));
    window.location.replace(url.toString());
  }, []);

  return null;
}
