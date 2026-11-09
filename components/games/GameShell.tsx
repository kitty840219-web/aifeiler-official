"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ARCADE_GAMES } from "@/lib/games/catalog";
import {useRef,useState,type CSSProperties,type ReactNode,type PointerEvent} from "react";
import GameScenery from "./GameScenery";
import scenery from "./GameScenery.module.css";
import {sceneVariables} from "@/lib/games/backgrounds";
import { useProgress } from "@/lib/games/progress";
import styles from "./Games.module.css";
import GameMascot from "./GameMascot";
import GameFeedback from "./GameFeedback";

export default function GameShell({ title, eyebrow, description, children, spacious = false }: { title: string; eyebrow: string; description: string; children: ReactNode; spacious?: boolean }) {
  const { progress, ready, persistent } = useProgress();
  const [bursts,setBursts]=useState<{id:number;x:number;y:number}[]>([]);const serial=useRef(0);
  function sparkle(e:PointerEvent<HTMLDivElement>){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!(e.target instanceof Element)||!e.target.closest("button,canvas,svg[role=img]"))return;const id=++serial.current;setBursts(b=>[...b.slice(-5),{id,x:e.clientX,y:e.clientY}]);}
  const pathname = usePathname().replace(/\/$/, "");
  const index = ARCADE_GAMES.findIndex(game => pathname.endsWith(`/games/${game.slug}`));
  const previous = index >= 0 ? ARCADE_GAMES[(index + ARCADE_GAMES.length - 1) % ARCADE_GAMES.length] : null;
  const next = index >= 0 ? ARCADE_GAMES[(index + 1) % ARCADE_GAMES.length] : null;
  return <div data-game-page="" className={`${styles.world} ${spacious ? styles.hubWorld : ""}`} style={sceneVariables(index>=0?ARCADE_GAMES[index].slug:"hub")} onPointerDownCapture={sparkle}>
    <div className={styles.topline}>{index>=0?<Link href="/games">← 星光遊樂園</Link>:<span aria-hidden="true"/>}<span className={styles.wallet} aria-label={`已收集 ${progress.stars} 顆星光`}>✦ {ready ? progress.stars : "—"}</span></div>
    <header className={styles.header}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>
    {index >= 0 && <GameScenery game={ARCADE_GAMES[index].slug} className={scenery.hero}><GameMascot game={ARCADE_GAMES[index].slug} size={160} className={scenery.mascot} alt={`${title}的艾飛樂角色`} /></GameScenery>}
    {index>=0&&<GameFeedback game={ARCADE_GAMES[index].slug} />}
    {children}
    {bursts.map(b=><span key={b.id} className={scenery.tapBurst} style={{left:b.x,top:b.y}} aria-hidden="true" onAnimationEnd={()=>setBursts(all=>all.filter(item=>item.id!==b.id))}>{Array.from({length:6},(_,i)=><i key={i} style={{"--spark-x":`${Math.cos(i*Math.PI/3)*32}px`,"--spark-y":`${Math.sin(i*Math.PI/3)*32}px`} as CSSProperties}>✦</i>)}</span>)}
    <nav className={styles.gameNav} aria-label="選擇遊戲"><Link href="/games">全部遊戲</Link>{previous && <Link href={`/games/${previous.slug}`} aria-label={`上一款：${previous.title}`} title={previous.title}>← 上一款</Link>}{next && <Link href={`/games/${next.slug}`} aria-label={`下一款：${next.title}`} title={next.title}>下一款 →</Link>}</nav>
    <p className={styles.footnote}>{persistent ? "免登入 · 星光與遊戲紀錄保存在這台裝置的瀏覽器，清除瀏覽資料後會重置。" : "瀏覽器目前無法儲存，進度僅保留於這次遊玩。"}</p>
  </div>;
}
