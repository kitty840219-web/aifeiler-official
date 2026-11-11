"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_EMBED_URL, PORTFOLIO_VIEW_URL } from "@/lib/data/portfolio";
import styles from "./CanvaPortfolioReader.module.css";

export default function CanvaPortfolioReader({ compact = false }: { compact?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);

  function openLandscape() {
    const target = dialog.current;
    if (!target) return;
    // Promote the same dialog to the top layer; the iframe is never remounted.
    target.close();
    target.showModal();
    setExpanded(true);
  }

  function restoreInline() {
    const target = dialog.current;
    if (!target || target.matches(":modal")) return;
    setExpanded(false);
    if (!target.open) target.show();
    openButton.current?.focus({ preventScroll: true });
  }

  return (
    <div data-portfolio-reader="canva" className={`overflow-hidden rounded-3xl border shadow-xl ${compact ? "mt-6 border-[#f4d892]/20 bg-[#0d0b2d]" : "border-[#dec99e] bg-white"}`}>
      <dialog ref={dialog} open onClose={restoreInline} aria-label={expanded ? "作品集橫向閱讀" : "作品集閱讀器"} aria-modal={expanded || undefined} className={`${styles.dialog} ${expanded ? styles.expanded : ""}`}>
        <div className={styles.viewport}>
          {expanded && <div className={styles.toolbar}><p>作品集 · 橫向閱讀</p><button type="button" aria-label="關閉橫向閱讀" onClick={() => dialog.current?.close()}>×</button></div>}
          <iframe title="李宛容 Ivy 最新作品集電子書" src={PORTFOLIO_EMBED_URL} loading="lazy" allow="fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className={styles.frame} />
        </div>
      </dialog>
      <div className={`flex flex-wrap items-center justify-center gap-3 px-4 py-4 text-center ${compact ? "text-[#f4d892]" : "border-t border-[#dec99e] text-[#94601d]"}`}>
        <p className="w-full text-sm font-bold tracking-wide sm:w-auto">李宛容 Ivy · 作品集電子書</p>
        <button ref={openButton} type="button" onClick={openLandscape} aria-label="開啟作品集橫向閱讀" className="rounded-full bg-[#d6a94f] px-4 py-2 text-sm font-semibold text-[#17143d] transition hover:bg-[#e2bd74]">橫向閱讀 ↻</button>
        <a href={PORTFOLIO_VIEW_URL} target="_blank" rel="noopener noreferrer" className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${compact ? "border-[#f4d892]/40 hover:bg-white/10" : "border-[#c7a66c] hover:bg-[#f3eadc]"}`}>另開閱讀 ↗</a>
      </div>
    </div>
  );
}
