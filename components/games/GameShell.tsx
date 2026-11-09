"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ARCADE_GAMES } from "@/lib/games/catalog";
import type { ReactNode } from "react";
import { useProgress } from "@/lib/games/progress";
import styles from "./Games.module.css";

export default function GameShell({ title, eyebrow, description, children, spacious = false }: { title: string; eyebrow: string; description: string; children: ReactNode; spacious?: boolean }) {
  const { progress, ready, persistent } = useProgress();
  const pathname = usePathname().replace(/\/$/, "");
  const index = ARCADE_GAMES.findIndex(game => pathname.endsWith(`/games/${game.slug}`));
  const previous = index >= 0 ? ARCADE_GAMES[(index + ARCADE_GAMES.length - 1) % ARCADE_GAMES.length] : null;
  const next = index >= 0 ? ARCADE_GAMES[(index + 1) % ARCADE_GAMES.length] : null;
  return <div className={`${styles.world} ${spacious ? styles.hubWorld : ""}`}>
    <div className={styles.topline}><Link href="/games">← 星光遊樂園</Link><span className={styles.wallet} aria-label={`已收集 ${progress.stars} 顆星光`}>✦ {ready ? progress.stars : "—"}</span></div>
    <header className={styles.header}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>
    {children}
    <nav className={styles.gameNav} aria-label="選擇遊戲"><Link href="/games">全部遊戲</Link>{previous && <Link href={`/games/${previous.slug}`} aria-label={`上一款：${previous.title}`} title={previous.title}>← 上一款</Link>}{next && <Link href={`/games/${next.slug}`} aria-label={`下一款：${next.title}`} title={next.title}>下一款 →</Link>}</nav>
    <p className={styles.footnote}>{persistent ? "免登入 · 星光與遊戲紀錄保存在這台裝置的瀏覽器，清除瀏覽資料後會重置。" : "瀏覽器目前無法儲存，進度僅保留於這次遊玩。"}</p>
  </div>;
}
