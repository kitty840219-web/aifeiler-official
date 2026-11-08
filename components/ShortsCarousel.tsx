"use client";

import { useRef, useState } from "react";
import styles from "./ShortsCarousel.module.css";

export default function ShortsCarousel({ videoIds }: { videoIds: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  function goTo(index: number) {
    const next = (index + videoIds.length) % videoIds.length;
    setPlaying(null);
    track.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  if (!videoIds.length) return null;

  return (
    <div className={styles.carousel} role="region" aria-roledescription="輪播" aria-label="真人 AI 短劇精選">
      <div
        ref={track}
        className={styles.track}
        onScroll={() => {
          const el = track.current;
          if (!el) return;
          const index = Math.round(el.scrollLeft / el.clientWidth);
          if (index !== active) { setActive(index); setPlaying(null); }
        }}
      >
        {videoIds.map((id, index) => (
          <div key={id} className={styles.slide} role="group" aria-roledescription="投影片" aria-label={`${index + 1} / ${videoIds.length}`}>
            <div className={styles.video}>
              {playing === id && active === index ? (
                <iframe
                  title={`艾飛樂真人 AI 短劇 ${index + 1}`}
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button type="button" className={styles.poster} onClick={() => setPlaying(id)} aria-label={`播放第 ${index + 1} 支真人 AI 短劇`}>
                  {/* Remote YouTube thumbnails are loaded only as posters; playback starts on tap. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={`真人 AI 短劇 ${index + 1} 封面`} loading="lazy" draggable={false} />
                  <span className={styles.play} aria-hidden="true">▶</span>
                  <span className={styles.caption}>艾比與思野 · 短劇 {String(index + 1).padStart(2, "0")}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => goTo(active - 1)} aria-label="上一支短劇">←</button>
        <span aria-live="polite">{active + 1} <span className={styles.total}>/ {videoIds.length}</span></span>
        <button type="button" onClick={() => goTo(active + 1)} aria-label="下一支短劇">→</button>
      </div>
      <div className={styles.dots} aria-label="選擇短劇">
        {videoIds.map((id, index) => <button key={id} type="button" onClick={() => goTo(index)} aria-label={`切換至第 ${index + 1} 支短劇`} aria-current={active === index ? "true" : undefined} />)}
      </div>
      <p className={styles.hint}>左右滑動切換，點選播放</p>
    </div>
  );
}
