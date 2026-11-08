"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/basePath";
import { LINKS } from "@/lib/data/site";
import { TAROT_TESTIMONIAL_PHOTOS } from "@/lib/data/tarotTestimonials";

export default function TarotTestimonials() {
  const [selected, setSelected] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: selected * track.clientWidth, behavior: "auto" });
    });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  function open(index: number) {
    setSelected(index);
    setCurrent(index);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setCurrent(index);
  }

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(TAROT_TESTIMONIAL_PHOTOS.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setCurrent(clamped);
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-4 text-paper">
      <h3 className="mb-1 text-xs font-semibold tracking-[0.2em] text-gold-light/70">客戶真實回饋</h3>
      <p className="mb-4 text-[11px] text-gold-light/50">真實好評持續累積中．點一下可滑動瀏覽</p>

      <button
        type="button"
        onClick={() => open(0)}
        className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-gold-light/20 bg-paper/[0.03] transition hover:border-gold-light/50"
      >
        <Image src={asset(TAROT_TESTIMONIAL_PHOTOS[0])} alt="塔羅占卜客戶回饋截圖" fill className="object-cover" sizes="400px" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night-dark/85 via-transparent to-transparent p-4">
          <p className="text-sm font-semibold text-paper">
            查看全部 {TAROT_TESTIMONIAL_PHOTOS.length} 則真實回饋 →
          </p>
        </div>
      </button>

      <a
        href={LINKS.googleReviews}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-full bg-gold-light py-3.5 text-center text-sm font-semibold text-[#0b0f2e] shadow-soft transition hover:bg-paper"
      >
        查看 Google 真實評論 →
      </a>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8"
          onClick={() => setSelected(null)}
        >
          <div className="relative h-full max-h-[85svh] w-full max-w-[430px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="關閉客戶回饋"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold-light text-xl font-bold text-[#0b0f2e] shadow-soft transition hover:bg-paper"
            >
              ✕
            </button>
            <div className="flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-gold-light/30 bg-night-dark p-4">
              <div className="relative min-h-[58vh] w-full flex-1">
                <div
                  ref={trackRef}
                  onScroll={handleScroll}
                  className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {TAROT_TESTIMONIAL_PHOTOS.map((src) => (
                    <div key={src} className="relative h-full w-full shrink-0 snap-center">
                      <Image src={asset(src)} alt="塔羅占卜客戶回饋截圖" fill className="object-contain" sizes="400px" />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goTo(current - 1)}
                  aria-label="上一則"
                  disabled={current === 0}
                  className="absolute left-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-night-dark/80 text-paper shadow-soft disabled:opacity-30"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => goTo(current + 1)}
                  aria-label="下一則"
                  disabled={current === TAROT_TESTIMONIAL_PHOTOS.length - 1}
                  className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-night-dark/80 text-paper shadow-soft disabled:opacity-30"
                >
                  ›
                </button>
              </div>

              <p className="mt-2 shrink-0 text-center text-[11px] text-gold-light/60">
                {current + 1} / {TAROT_TESTIMONIAL_PHOTOS.length}
              </p>

              <a
                href={LINKS.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 shrink-0 rounded-full bg-gold-light py-3 text-center text-sm font-semibold text-[#0b0f2e] transition hover:bg-paper"
              >
                查看 Google 真實評論 →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
