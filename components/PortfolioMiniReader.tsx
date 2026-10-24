"use client";

import Image from "next/image";
import { useState } from "react";
import { asset } from "@/lib/basePath";
import { portfolioImage } from "@/lib/data/portfolio";

const TOTAL_PAGES = 41;

export default function PortfolioMiniReader() {
  const [page, setPage] = useState(1);

  function goTo(next: number) {
    const clamped = Math.min(TOTAL_PAGES, Math.max(1, next));
    if (clamped === page) return;
    setPage(clamped);
  }

  return (
    <div className="group mt-6 overflow-hidden rounded-3xl border border-[#f4d892]/20 bg-[#0d0b2d] shadow-2xl transition hover:border-[#f4d892]/40">
      <div
        role="button"
        tabIndex={0}
        onClick={() => goTo(page + 1)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goTo(page + 1);
          }
        }}
        aria-label="點擊翻到下一頁"
        className="block w-full cursor-pointer bg-white"
      >
        <Image
          key={page}
          src={asset(portfolioImage(page))}
          alt={`李宛容作品集第 ${page} 頁`}
          width={1600}
          height={900}
          sizes="(min-width: 640px) 512px, 100vw"
          className="h-full w-full object-cover"
          priority={page === 1}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.22em] text-[#f4d892]">PORTFOLIO</p>
          <h3 className="mt-1 font-serif text-base font-bold text-white">翻閱作品集 PPT</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            aria-label="上一頁"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f4d892]/35 text-[#f4d892] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>
          <span className="text-xs text-white/60">{page}/{TOTAL_PAGES}</span>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === TOTAL_PAGES}
            aria-label="下一頁"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f4d892]/35 text-[#f4d892] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
