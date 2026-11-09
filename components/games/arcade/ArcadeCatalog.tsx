"use client";

import {useState} from "react";
import Link from "next/link";
import {ARCADE_GAMES,GAME_CATEGORIES,type GameCategory} from "@/lib/games/catalog";
import styles from "./Arcade.module.css";
import GameMascot from "../GameMascot";
import GameScenery from "../GameScenery";

export default function ArcadeCatalog(){
 const [selected,setSelected]=useState<GameCategory>("all");
 const games=selected==="all"?ARCADE_GAMES:ARCADE_GAMES.filter(game=>game.group===selected);
 const label=GAME_CATEGORIES.find(category=>category.id===selected)!.label;
 return <section className={styles.catalogSection} aria-labelledby="arcade-catalog-title">
  <p className={styles.catalogLabel}>AIFEILER · LITTLE GAME COLLECTION</p><h2 id="arcade-catalog-title">一起玩遊戲</h2><p>選一個喜歡的小世界，收集屬於你的光。</p>
  <div className={styles.categoryFilters} role="group" aria-label="遊戲分類">{GAME_CATEGORIES.map(category=><button key={category.id} type="button" aria-pressed={selected===category.id} aria-controls="game-catalog-results" onClick={()=>setSelected(category.id)}>{category.label}</button>)}</div>
  <p className={styles.filterCount} role="status" aria-live="polite">{label} · 共 {games.length} 款遊戲</p>
  <div id="game-catalog-results" className={styles.catalog}>{games.map(g=><Link href={`/games/${g.slug}`} key={g.slug}>
   <GameScenery game={g.slug} className={styles.miniStage}><GameMascot game={g.slug} size={112} /></GameScenery>
   <h3>{g.title}</h3><p>{g.category}</p><b>開始玩 ↗</b>
  </Link>)}</div>
 </section>;
}
