"use client";

import Image from "next/image";
import { useState } from "react";
import { asset } from "@/lib/basePath";
import { BOOK_TOTAL_PAGES as TOTAL, bookImage } from "@/lib/data/book";

export default function AifeilerBookMiniReader() {
  const [page, setPage] = useState(1);
  const visiblePages = page < TOTAL ? [page, page + 1] : [page];
  const pageLabel = visiblePages.length === 2 ? `${page}-${page + 1}` : String(page);

  function goTo(next: number) {
    const clamped = Math.min(TOTAL, Math.max(1, next));
    if (clamped === page) return;
    setPage(clamped);
  }

  return (
    <div className="group mt-6 overflow-hidden rounded-3xl border border-[#f4d892]/20 bg-[#0d0b2d] shadow-2xl transition hover:border-[#f4d892]/40">
      <div
        role="button"
        tabIndex={0}
        onClick={() => goTo(page + 2)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goTo(page + 2);
          }
        }}
        aria-label="點擊翻到下一頁"
        className="grid cursor-pointer grid-cols-2 gap-px bg-[#efe4d2] p-2"
      >
        {visiblePages.map((p) => (
          <Image
            key={p}
            src={asset(bookImage(p))}
            alt={`《遺落在風中的信》第 ${p} 頁`}
            width={720}
            height={1023}
            sizes="256px"
            className="h-full w-full object-contain"
            priority={p === 1}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.22em] text-[#f4d892]">E-BOOK</p>
          <h3 className="mt-1 font-serif text-base font-bold text-white">閱讀《遺落在風中的信》</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(page - 2)}
            disabled={page === 1}
            aria-label="上一頁"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f4d892]/35 text-[#f4d892] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>
          <span className="text-xs text-white/60">{pageLabel}/{TOTAL}</span>
          <button
            type="button"
            onClick={() => goTo(page + 2)}
            disabled={page + 2 > TOTAL}
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
