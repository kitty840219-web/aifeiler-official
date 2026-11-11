"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/basePath";
import styles from "./FlipBookReader.module.css";

type Props = { title: string; pages: string[]; landscape?: boolean; originalUrl?: string };

export default function FlipBookReader({ title, pages, landscape = false, originalUrl }: Props) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(-1);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const busy = loaded !== page;

  useEffect(() => {
    // Only warm the adjacent page; do not download the whole book up front.
    if (!pages[page + 1]) return;
    const next = new window.Image();
    next.src = asset(pages[page + 1]);
  }, [page, pages]);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);

  function go(delta: number) {
    setPage(current => Math.min(pages.length - 1, Math.max(0, current + delta)));
  }
  function open() {
    dialog.current?.close();
    dialog.current?.showModal();
    setExpanded(true);
  }
  function restore() {
    if (dialog.current?.matches(":modal")) return;
    setExpanded(false);
    if (!dialog.current?.open) dialog.current?.show();
    opener.current?.focus({ preventScroll: true });
  }

  return (
    <div className={styles.reader} data-flip-book={landscape ? "portfolio" : "novel"}>
      <dialog open ref={dialog} onClose={restore} aria-label={`${title}閱讀器`} aria-modal={expanded || undefined} className={`${styles.dialog} ${expanded ? styles.expanded : ""} ${landscape ? styles.landscape : ""}`}>
        <div className={styles.layout}>
          {expanded && <button className={styles.close} type="button" aria-label={`關閉${title}放大閱讀`} onClick={() => dialog.current?.close()}>×</button>}
          <div className={styles.sheet} role="group" aria-label={`${title}第 ${page + 1} 頁`} tabIndex={0}
            onKeyDown={e => { if (["ArrowRight", "ArrowLeft", "Enter", " "].includes(e.key)) { e.preventDefault(); go(e.key === "ArrowLeft" ? -1 : 1); } }}
            onTouchStart={e => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; swiped.current = false; }}
            onTouchEnd={e => {
              if (!start.current) return;
              const dx = e.changedTouches[0].clientX - start.current.x;
              const dy = e.changedTouches[0].clientY - start.current.y;
              // In the portrait landscape reader, the page is rotated clockwise.
              const rotated = expanded && landscape && window.matchMedia("(orientation: portrait)").matches;
              const movement = rotated ? dy : dx;
              const cross = rotated ? dx : dy;
              if (Math.abs(movement) > 40 && Math.abs(movement) > Math.abs(cross) * 1.3) { swiped.current = true; go(movement < 0 ? 1 : -1); }
              start.current = null;
            }}
            onClick={e => {
              if (swiped.current) { swiped.current = false; return; }
              const rect = e.currentTarget.getBoundingClientRect();
              const rotated = expanded && landscape && window.matchMedia("(orientation: portrait)").matches;
              const ratio = rotated ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width;
              go(ratio < 0.35 ? -1 : 1);
            }}>
            <Image key={page} src={asset(pages[page])} alt={`${title}第 ${page + 1} 頁`} width={landscape ? 1600 : 720} height={landscape ? 900 : 1023} sizes="(max-width: 640px) 100vw, 900px" className={styles.image} onLoad={() => setLoaded(page)} draggable={false} />
            {busy && <span className={styles.loading} role="status">載入書頁中…</span>}
          </div>
          <div className={styles.pageNav}>
            <button type="button" disabled={page === 0} onClick={() => go(-1)} aria-label={`${title}上一頁`}>←</button>
            <span aria-live="polite">{page + 1} / {pages.length}</span>
            <button type="button" disabled={page === pages.length - 1} onClick={() => go(1)} aria-label={`${title}下一頁`}>→</button>
          </div>
        </div>
      </dialog>
      <div className={styles.details}>
        <p className={styles.title}>{title}</p>
        <p className={styles.hint}>點右側下一頁・點左側上一頁・左右滑動翻頁</p>
        <div className={styles.actions}>
          <button ref={opener} type="button" onClick={open}>{landscape ? "橫向放大閱讀 ↻" : "放大閱讀 ↗"}</button>
          {originalUrl && <a href={originalUrl} target="_blank" rel="noopener noreferrer">另開原版 ↗</a>}
        </div>
      </div>
    </div>
  );
}
