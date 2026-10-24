"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { asset } from "@/lib/basePath";
import { portfolioImage } from "@/lib/data/portfolio";

const TOTAL_PAGES = 41;
export default function PortfolioGallery() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const goTo = (nextPage: number) => setPage(Math.min(TOTAL_PAGES, Math.max(1, nextPage)));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setPage((current) => Math.max(1, current - 1));
      if (event.key === "ArrowRight") setPage((current) => Math.min(TOTAL_PAGES, current + 1));
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  return (
    <section id="portfolio-book" className="scroll-mt-24 bg-[#fffaf2] px-3 pb-14 pt-4 sm:px-8 sm:pb-20 sm:pt-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="sr-only">翻閱我的作品集</h2>
        <div className="overflow-hidden rounded-[1.5rem] border border-[#dec99e] bg-white shadow-[0_24px_70px_rgba(76,54,21,0.15)]">
          <div className="bg-white"><Image key={page} src={asset(portfolioImage(page))} alt={`李宛容作品集第 ${page} 頁`} width={1600} height={900} sizes="(min-width: 1024px) 1150px, 100vw" className="h-auto w-full" priority={page <= 2} /></div>
          <div className="border-t border-[#dec99e] px-4 py-4 sm:px-6 sm:py-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-[0.2em] text-[#94601d]">李宛容 IVY · 電子書</p>
              <button type="button" onClick={() => setExpanded(true)} className="rounded-full border border-[#c7a66c] px-3 py-2 text-sm font-semibold text-[#94601d] transition hover:bg-[#d6a94f] hover:text-white" aria-label="全螢幕放大目前頁面">全螢幕 ↗</button>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#f3eadc]"><div className="h-full rounded-full bg-[#d6a94f] transition-all" style={{ width: `${(page / TOTAL_PAGES) * 100}%` }} /></div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1} className="justify-self-start rounded-full border border-[#c7a66c] px-3 py-2.5 text-sm font-bold text-[#94601d] disabled:cursor-not-allowed disabled:opacity-30 sm:px-4">← 上一頁</button>
              <p className="font-serif text-sm font-bold text-[#2b2a5c] sm:text-base"><span className="text-lg text-[#94601d] sm:text-xl">{page}</span> / {TOTAL_PAGES}</p>
              <button type="button" onClick={() => goTo(page + 1)} disabled={page === TOTAL_PAGES} className="justify-self-end rounded-full bg-[#d6a94f] px-3 py-2.5 text-sm font-bold text-[#17143d] disabled:cursor-not-allowed disabled:opacity-30 sm:px-4">下一頁 →</button>
            </div>
          </div>
        </div>
      </div>

      {expanded && <div role="dialog" aria-modal="true" aria-label={`作品集第 ${page} 頁`} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 sm:p-8" onClick={() => setExpanded(false)}>
        <button type="button" onClick={() => setExpanded(false)} className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-3xl text-night-dark shadow-lg" aria-label="關閉大圖">×</button>
        <Image src={asset(portfolioImage(page))} alt={`李宛容作品集第 ${page} 頁放大圖`} width={1600} height={900} sizes="100vw" className="max-h-[94vh] w-auto max-w-full rounded-lg object-contain" priority onClick={(event) => event.stopPropagation()} />
      </div>}
    </section>
  );
}
