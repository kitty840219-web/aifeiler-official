"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { asset } from "@/lib/basePath";

export default function AboutJourney() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  if (pathname === "/" || !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 pt-8"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative h-full max-h-[85svh] w-full max-w-[430px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="關閉品牌故事視窗"
          className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-xl font-bold text-night-dark shadow-soft transition hover:bg-gold-light"
        >
          ✕
        </button>

        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-paper text-night-dark shadow-soft">
          <div className="relative min-h-0 flex-1 overflow-hidden bg-paper">
            <Image
              src={asset("/images/about-brand-poster.webp")}
              alt="艾飛樂語錄品牌宣傳圖：天空越黑，星星越亮，寫出我們的共鳴"
              fill
              priority
              className="object-contain"
              sizes="430px"
            />
          </div>
          <div className="shrink-0 bg-paper px-5 pb-5 pt-3 text-center">
            <button onClick={() => setOpen(false)} className="w-full rounded-full bg-gold px-5 py-3.5 text-sm font-bold text-night-dark shadow-soft">
              進入遊戲 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
