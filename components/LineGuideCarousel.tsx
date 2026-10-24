"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/basePath";

type Step = { src: string; label: string };

export default function LineGuideCarousel({ steps }: { steps: Step[] }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setCurrent(index);
  }

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setCurrent(clamped);
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex w-full snap-x snap-mandatory overflow-x-auto rounded-2xl border border-gold/20 bg-night-light/20 shadow-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((s) => (
            <div key={s.src} className="relative aspect-square w-full shrink-0 snap-center">
              <Image src={asset(s.src)} alt={s.label} fill className="object-cover" sizes="430px" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="上一張"
          disabled={current === 0}
          className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-night-dark/80 text-paper shadow-soft disabled:opacity-30"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="下一張"
          disabled={current === steps.length - 1}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-night-dark/80 text-paper shadow-soft disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {steps.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`前往第 ${i + 1} 張`}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-gold" : "w-1.5 bg-paper/25"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-paper/70">{steps[current].label}</p>
    </div>
  );
}
