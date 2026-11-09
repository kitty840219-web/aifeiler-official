"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useProgress } from "@/lib/games/progress";
import styles from "./Games.module.css";

export default function GameShell({ title, eyebrow, description, children, spacious = false }: { title: string; eyebrow: string; description: string; children: ReactNode; spacious?: boolean }) {
  const { progress, ready, persistent } = useProgress();
  return <div className={`${styles.world} ${spacious ? styles.hubWorld : ""}`}>
    <div className={styles.topline}><Link href="/games">← 星光遊樂園</Link><span className={styles.wallet} aria-label={`已收集 ${progress.stars} 顆星光`}>✦ {ready ? progress.stars : "—"}</span></div>
    <header className={styles.header}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>
    {children}
    <nav className={styles.gameNav} aria-label="選擇遊戲"><Link href="/games/memory">翻翻樂</Link><Link href="/games/stars">接接樂</Link><Link href="/games/garden">心情花園</Link></nav>
    <p className={styles.footnote}>{persistent ? "免登入 · 星光與花園保存在這台裝置的瀏覽器，清除瀏覽資料後會重置。" : "瀏覽器目前無法儲存，進度僅保留於這次遊玩。"}</p>
  </div>;
}
