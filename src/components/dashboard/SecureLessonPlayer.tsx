"use client";

import { useEffect, useRef } from "react";
import { Lock, PlayCircle } from "lucide-react";
import { youtubePrivacyEmbedSrc } from "@/lib/youtube";

/**
 * Paid-member lesson player:
 * - Embeds inside dashboard only (youtube-nocookie)
 * - Never shows a YouTube watch/share URL
 * - Does not navigate the parent window to YouTube
 */
export function SecureLessonPlayer({
  youtubeId,
  title,
  unlocked,
}: {
  youtubeId?: string | null;
  title: string;
  unlocked: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const block = (e: Event) => e.preventDefault();
    el.addEventListener("contextmenu", block);
    return () => el.removeEventListener("contextmenu", block);
  }, [youtubeId]);

  if (!unlocked) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 text-center">
        <Lock className="h-8 w-8 text-amber-700" />
        <p className="text-sm font-semibold text-amber-950">Video locked</p>
        <p className="max-w-sm text-xs leading-5 text-amber-800">
          Yeh private lesson video sirf paid package (Edu / BP) ke baad dashboard ke andar play hoti
          hai.
        </p>
      </div>
    );
  }

  if (!youtubeId) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
        <PlayCircle className="h-8 w-8 text-slate-400" />
        <p className="text-sm font-medium text-slate-600">Video soon</p>
        <p className="text-xs text-slate-500">Admin is lesson ke liye private YouTube ID add karega.</p>
      </div>
    );
  }

  const src = youtubePrivacyEmbedSrc(youtubeId);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0b1220] px-3 py-2">
        <p className="truncate text-xs font-medium text-white/80">{title}</p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
          Members only · In-app
        </span>
      </div>
      <div
        ref={wrapRef}
        className="relative aspect-video w-full bg-black"
        onContextMenu={(e) => e.preventDefault()}
      >
        <iframe
          key={youtubeId}
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </div>
      <p className="bg-[#0b1220] px-3 py-2 text-[11px] text-white/45">
        Streaming inside Sri Magicale dashboard only — YouTube page pe redirect nahi hota, public
        link yahan show nahi hota.
      </p>
    </div>
  );
}
