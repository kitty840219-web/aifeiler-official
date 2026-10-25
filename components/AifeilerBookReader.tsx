"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { asset } from "@/lib/basePath";
import { BOOK_PAGES, BOOK_TOTAL_PAGES as TOTAL, bookImage } from "@/lib/data/book";

const BOOKMARKS = [
  { sourcePage: 1, label: "封面" }, { sourcePage: 10, label: "目錄" }, { sourcePage: 13, label: "序言" },
  { sourcePage: 20, label: "生命故事" }, { sourcePage: 60, label: "愛與關係" },
  { sourcePage: 94, label: "成長與放下" }, { sourcePage: 132, label: "找回自己" }, { sourcePage: 151, label: "作者與封底" },
];

function displayPageFor(sourcePage: number) {
  return BOOK_PAGES.findIndex((page) => page >= sourcePage) + 1;
}

export default function AifeilerBookReader() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [showSpread, setShowSpread] = useState(false);
  const goTo = (value: number) => setPage(Math.min(TOTAL, Math.max(1, value)));

  useEffect(() => {
    const syncLayout = () => setShowSpread(document.documentElement.dataset.viewMode === "desktop");
    syncLayout();
    const observer = new MutationObserver(syncLayout);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-view-mode"] });
    window.addEventListener("resize", syncLayout);
    return () => { observer.disconnect(); window.removeEventListener("resize", syncLayout); };
  }, []);

  useEffect(() => {
    [page + 1, page + 2].filter((next) => next <= TOTAL).forEach((next) => {
      const preload = new window.Image();
      preload.src = asset(bookImage(next));
    });
  }, [page]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      const step = showSpread ? 2 : 1;
      if (event.key === "ArrowLeft") setPage((current) => Math.max(1, current - step));
      if (event.key === "ArrowRight") setPage((current) => Math.min(TOTAL, current + step));
      if (event.key === "Escape") setExpanded(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [expanded, showSpread]);

  const step = showSpread ? 2 : 1;
  const visiblePages = showSpread && page < TOTAL ? [page, page + 1] : [page];
  const pageLabel = visiblePages.length === 2 ? `${page}–${page + 1}` : String(page);

  function renderPages(expandedView = false) {
    return <div className={`grid items-center justify-center ${visiblePages.length === 2 ? "grid-cols-2 gap-1" : "grid-cols-1"}`}>
      {visiblePages.map((visiblePage) => <Image key={`${expandedView ? "expanded" : "reader"}-${visiblePage}`} src={asset(bookImage(visiblePage))} alt={`《遺落在風中的信》第 ${visiblePage} 頁`} width={720} height={1023} sizes={visiblePages.length === 2 ? "50vw" : "(min-width: 768px) 620px, 94vw"} className={`${expandedView ? "max-h-[94svh]" : "max-h-[76svh]"} h-auto w-auto max-w-full object-contain`} priority={visiblePage <= 2} />)}
    </div>;
  }

  return (
    <section id="aifeiler-book" className="bg-[#efe4d2] px-3 py-14 text-[#31294e] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.3em] text-[#9b7132]">BOOK PROJECT · 2025</p>
          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">《遺落在風中的信》</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#31294e]/70 sm:text-lg">由李宛容 Ivy 創作的療癒圖文書。電腦版以左右跨頁呈現，手機版則維持單頁閱讀，完整保留封面、正文、作者介紹與封底。</p>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {BOOKMARKS.map((mark) => <button key={mark.sourcePage} type="button" onClick={() => goTo(displayPageFor(mark.sourcePage))} className="rounded-full border border-[#9b7132]/40 bg-white/40 px-3 py-2 text-sm font-bold hover:bg-white/80">{mark.label}</button>)}
        </div>

        <div className="mx-auto mt-7 max-w-3xl overflow-hidden rounded-[1.75rem] border border-[#9b7132]/35 bg-[#17143d] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 text-[#f4d892] sm:px-6"><div><p className="text-xs font-bold tracking-[0.2em]">AIFEILER BOOK</p><p className="mt-1 text-sm text-white/55">圖・文｜李宛容 Ivy</p></div><button type="button" onClick={() => setExpanded(true)} className="rounded-full border border-[#f4d892]/40 px-3 py-2 text-sm font-bold">放大閱讀 ↗</button></div>
          <div className="flex min-h-[420px] items-center justify-center bg-[#0d0b24] p-3 sm:p-6">{renderPages()}</div>
          <div className="border-t border-white/10 px-4 py-4 sm:px-6">
            <input aria-label="跳至指定頁數" type="range" min="1" max={TOTAL} value={page} onChange={(event) => goTo(Number(event.target.value))} className="mb-4 w-full accent-[#d6a94f]" />
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <button type="button" onClick={() => goTo(page - step)} disabled={page === 1} className="justify-self-start rounded-full border border-[#f4d892]/40 px-3 py-2.5 text-sm font-bold text-[#f4d892] disabled:opacity-30">← 上一頁</button>
              <p className="font-serif text-sm font-bold text-white"><span className="text-xl text-[#f4d892]">{pageLabel}</span> / {TOTAL}</p>
              <button type="button" onClick={() => goTo(page + step)} disabled={page + step > TOTAL} className="justify-self-end rounded-full bg-[#d6a94f] px-3 py-2.5 text-sm font-bold text-[#17143d] disabled:opacity-30">下一頁 →</button>
            </div>
          </div>
        </div>
      </div>

      {expanded && <div role="dialog" aria-modal="true" aria-label={`《遺落在風中的信》第 ${pageLabel} 頁`} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-2 sm:p-6" onClick={() => setExpanded(false)}><button type="button" onClick={() => setExpanded(false)} aria-label="關閉電子書放大畫面" className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#d6a94f] text-3xl text-[#17143d]">×</button><div onClick={(event) => event.stopPropagation()}>{renderPages(true)}</div></div>}
    </section>
  );
}
