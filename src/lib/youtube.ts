/**
 * Store only YouTube video IDs (never public watch URLs in the member UI).
 * Playback uses privacy-enhanced embed inside the dashboard iframe only.
 */

const ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;
  if (ID_RE.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && ID_RE.test(id) ? id : null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && ID_RE.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      // /embed/ID or /shorts/ID or /live/ID
      const idx = parts.findIndex((p) => ["embed", "shorts", "live", "v"].includes(p));
      if (idx >= 0 && parts[idx + 1] && ID_RE.test(parts[idx + 1])) {
        return parts[idx + 1];
      }
    }
  } catch {
    // not a URL
  }

  return null;
}

/** Dashboard-only embed URL — no watch page redirect from our UI */
export function youtubePrivacyEmbedSrc(videoId: string) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
    fs: "1",
    autoplay: "0",
    // Keep controls for learning UX; never surface a public watch URL in our chrome
  });
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}
