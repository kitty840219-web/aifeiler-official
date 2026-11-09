"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import GameShell from "../GameShell";
import { updateProgress } from "@/lib/games/progress";
import styles from "./Arcade.module.css";

const RECORD_EVENT = "aifeiler-arcade-record";
export function useRecord(game: string) {
  const best = useSyncExternalStore(
    (notify) => { window.addEventListener(RECORD_EVENT, notify); window.addEventListener("storage", notify); return () => { window.removeEventListener(RECORD_EVENT, notify); window.removeEventListener("storage", notify); }; },
    () => { try { const n = Number(localStorage.getItem(`aifeiler-best-${game}`)); return Number.isFinite(n) ? Math.max(0, n) : 0; } catch { return 0; } },
    () => 0,
  );
  function save(score: number) {
    try { const old = Number(localStorage.getItem(`aifeiler-best-${game}`)) || 0; localStorage.setItem(`aifeiler-best-${game}`, String(Math.max(old, score))); } catch { /* Scores remain playable without storage. */ }
    window.dispatchEvent(new Event(RECORD_EVENT));
    const reward = Math.min(15, Math.max(0, Math.floor(score / 5)));
    if (reward) updateProgress(p => ({ ...p, stars: p.stars + reward }));
  }
  return { best, save };
}

export default function ArcadeFrame({ title, description, rules, children }: { title: string; description: string; rules: string[]; children: ReactNode }) {
  return <GameShell title={title} eyebrow="AIFEILER · PLAY IN A LITTLE DIMENSION" description={description}>
    <div className={styles.arcade}>
      <details className={styles.guide}><summary>遊戲說明</summary><ol>{rules.map(rule => <li key={rule}>{rule}</li>)}</ol></details>
      {children}
      <p className={styles.note}>艾飛樂立體風格版 · 手機與電腦都能玩<br />結算每 5 分可獲 1 星光，每局最多 15 星光。</p>
    </div>
  </GameShell>;
}
