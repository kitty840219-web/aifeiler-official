"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { asset } from "@/lib/basePath";

export default function ServiceCarousel({
  services,
  art,
}: {
  services: { title: string; desc: string }[];
  art: string[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.clientWidth;
    const next = Math.round(track.scrollLeft / cardWidth);
    setIndex(Math.max(0, Math.min(services.length - 1, next)));
  }

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((s, i) => (
          <div
            key={s.title}
            className="bg-grain relative w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-night-light/40 p-6 text-center shadow-card"
          >
            <div className="relative mx-auto mb-3 h-32 w-full animate-float-slow">
              <Image
                src={asset(art[i])}
                alt={`${s.title}小艾插畫`}
                fill
                className="object-contain"
                sizes="80vw"
              />
            </div>
            <h3 className="font-serif text-lg font-bold text-gold-light">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper/70">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {services.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`查看${s.title}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-gold" : "w-1.5 bg-paper/25"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-paper/60">左右滑動查看更多服務項目 →</p>
    </div>
  );
}
