"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Chapter } from "@/lib/data/story";
import styles from "./StoryReader.module.css";

export default function StoryReader({ chapters, finish, finishHref }: { chapters: Chapter[]; finish?: { label: string; onClick: () => void }; finishHref?: string }) {
  const frames = useMemo(() => chapters.flatMap(chapter => [
    ...chapter.body.map(text => ({ tag: chapter.tag, title: chapter.title, text, quote: false })),
    ...(chapter.quote ? [{ tag: chapter.tag, title: chapter.title, text: `「${chapter.quote}」`, quote: true }] : []),
  ]), [chapters]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [replay, setReplay] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const finished = index >= frames.length;
  const frame = frames[Math.min(index, frames.length - 1)];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    if (stage.current) observer.observe(stage.current);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(media.matches);
    const syncTab = () => setTabVisible(!document.hidden);
    syncMotion(); syncTab();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncTab);
    return () => { observer.disconnect(); media.removeEventListener("change", syncMotion); document.removeEventListener("visibilitychange", syncTab); };
  }, []);

  function restart() { setIndex(0); setReplay(n => n + 1); setRunning(true); }

  return (
    <div className={styles.reader}>
      <div ref={stage} className={styles.stage} aria-label="艾飛樂的故事・六章連續播放">
        {finished ? <div className={styles.ending} role="status"><p>艾飛樂的故事</p><h3>謝謝你，讀到這裡。</h3><p>願每一段故事，都能留下溫柔的共鳴。</p></div> : reduced ?
          <div className={styles.transcript}>{chapters.map(chapter => <section key={chapter.tag}><p className={styles.tag}>{chapter.tag}</p><h3>{chapter.title}</h3>{chapter.body.map((text, i) => <p key={i}>{text}</p>)}{chapter.quote && <blockquote>「{chapter.quote}」</blockquote>}</section>)}</div> :
          <div key={`${replay}-${index}`} className={`${styles.frame} ${frame.quote ? styles.quote : ""}`} style={{ animationDuration: `${Math.max(10, frame.text.length / 7 + 5)}s`, animationPlayState: running && visible && tabVisible ? "running" : "paused" }} onAnimationEnd={() => setIndex(n => n + 1)}>
            <p className={styles.tag}>{frame.tag}</p>
            <h3>{frame.title}</h3>
            <p className={styles.text}>{frame.text}</p>
          </div>}
      </div>
      <div className={styles.controls}>
        {!finished && !reduced && <button type="button" onClick={() => setRunning(v => !v)}>{running ? "暫停" : "繼續播放"}</button>}
        <button type="button" onClick={restart}>↻ 重播</button>
        {finished && finish && <button type="button" onClick={finish.onClick}>{finish.label}</button>}
        {finished && !finish && finishHref && <Link href={finishHref}>繼續認識作者 ↓</Link>}
      </div>
    </div>
  );
}
