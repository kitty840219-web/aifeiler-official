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
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const timeline = useMemo(() => frames.reduce<Array<(typeof frames)[number] & { start: number; duration: number }>>((items, frame) => {
    const previous = items.at(-1);
    return [...items, { ...frame, start: previous ? previous.start + previous.duration : 0, duration: Math.ceil(Math.max(5, Math.min(12, frame.text.length / 15 + 2))) }];
  }, []), [frames]);
  const duration = timeline.length ? timeline[timeline.length - 1].start + timeline[timeline.length - 1].duration : 0;
  const finished = elapsed >= duration;
  const index = Math.max(0, timeline.findIndex(frame => elapsed < frame.start + frame.duration));
  const frame = timeline[finished ? timeline.length - 1 : index];
  const progress = (elapsed - frame.start) / frame.duration;
  const opacity = !running || reduced ? 1 : Math.max(0, Math.min(1, progress / 0.06, (1 - progress) / 0.06));
  const chapterIndex = chapters.findIndex(chapter => chapter.tag === frame.tag);
  const time = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  useEffect(() => {
    if (!running || !visible || !tabVisible || reduced || finished) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - previous) / 1000;
      previous = now;
      setElapsed(value => Math.min(duration, value + delta));
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, visible, tabVisible, reduced, finished, duration]);

  function advance() {
    if (reduced || finished) return;
    setElapsed(index + 1 < timeline.length ? timeline[index + 1].start + 0.4 : duration);
  }
  function previous() {
    setElapsed(timeline[Math.max(0, (finished ? timeline.length : index) - 1)].start + 0.4);
  }

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

  function restart() { setElapsed(0); setRunning(true); }

  return (
    <div className={styles.reader}>
      <div ref={stage} className={styles.stage} role={reduced ? undefined : "button"} tabIndex={reduced ? undefined : 0} aria-label="艾飛樂的故事・點一下跳到下一頁" onClick={advance} onKeyDown={event => { if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") { event.preventDefault(); advance(); } else if (event.key === "ArrowLeft") { event.preventDefault(); previous(); } }}>
        {finished ? <div className={styles.ending} role="status"><p>艾飛樂的故事</p><h3>謝謝你，讀到這裡。</h3><p>願每一段故事，都能留下溫柔的共鳴。</p></div> : reduced ?
          <div className={styles.transcript}>{chapters.map(chapter => <section key={chapter.tag}><p className={styles.tag}>{chapter.tag}</p><h3>{chapter.title}</h3>{chapter.body.map((text, i) => <p key={i}>{text}</p>)}{chapter.quote && <blockquote>「{chapter.quote}」</blockquote>}</section>)}</div> :
          <div className={`${styles.frame} ${frame.quote ? styles.quote : ""}`} style={{ opacity }}>
            <p className={styles.tag}>{frame.tag}</p>
            <h3>{frame.title}</h3>
            <p className={styles.text}>{frame.text}</p>
          </div>}
      </div>
      {!reduced && <div className={styles.player} aria-label="故事播放器">
        <div className={styles.status} aria-live="off"><span>{finished ? "播放完畢" : `${frame.tag} · 第 ${chapterIndex + 1} / ${chapters.length} 章`}</span><span>{finished ? frames.length : index + 1} / {frames.length} 頁</span></div>
        <input className={styles.seek} type="range" min="0" max={duration} step="0.1" value={elapsed} onChange={event => setElapsed(Number(event.target.value))} aria-label="故事播放進度" aria-valuetext={`${time(elapsed)}，${finished ? "播放完畢" : frame.tag}`} style={{ background: `linear-gradient(to right, #a78344 ${duration ? elapsed / duration * 100 : 0}%, #e5d8bf 0%)` }} />
        <div className={styles.transport}>
          <button type="button" onClick={previous} disabled={elapsed === 0} aria-label="故事上一頁">❮</button>
          <button type="button" className={styles.play} onClick={() => { if (finished) restart(); else setRunning(value => !value); }} aria-label={finished ? "重播故事" : running ? "暫停故事" : "播放故事"}>{!finished && running ? "Ⅱ" : "▶"}</button>
          <button type="button" onClick={advance} disabled={finished} aria-label="故事下一頁">❯</button>
          <span className={styles.time}>{time(elapsed)} / {time(duration)}</span>
          <button type="button" onClick={restart} aria-label="從頭重播故事">↻</button>
        </div>
        <p className={styles.hint}>點一下文字畫面，直接下一頁</p>
      </div>}
      <div className={styles.controls}>
        {finished && finish && <button type="button" onClick={finish.onClick}>{finish.label}</button>}
        {finished && !finish && finishHref && <Link href={finishHref}>繼續認識作者 ↓</Link>}
      </div>
    </div>
  );
}
