"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {GAME_CATEGORIES,type GameCategory} from "@/lib/games/catalog";
import {NUMBERED_GAMES} from "@/lib/games/displayCatalog";
import LearningMascot from "@/components/learning/LearningMascot";
import styles from "./Arcade.module.css";
import GameMascot from "../GameMascot";
import GameScenery from "../GameScenery";
const allGames=NUMBERED_GAMES;
export default function ArcadeCatalog(){
 const router=useRouter();
 const[selected,setSelected]=useState<GameCategory>("all");
 const games=selected==="all"?allGames:allGames.filter(game=>game.group===selected);
 const label=GAME_CATEGORIES.find(category=>category.id===selected)!.label;
 return <section className={styles.catalogSection} aria-labelledby="arcade-catalog-title">
  <p className={styles.catalogLabel}>AIFEILER · LITTLE GAME COLLECTION</p><h2 id="arcade-catalog-title">一起玩遊戲</h2><p>選一個喜歡的小世界，收集屬於你的光。</p>
  <div className={styles.categoryFilters} role="group" aria-label="遊戲分類">{GAME_CATEGORIES.map(category=><button key={category.id} type="button" aria-pressed={selected===category.id} aria-controls="game-catalog-results" onClick={()=>category.id==="language"?router.push("/learn/"):setSelected(category.id)}>{category.label}</button>)}</div>
  <p className={styles.filterCount} role="status" aria-live="polite">{label} · 共 {games.length} 款遊戲</p>
  <div id="game-catalog-results" className={styles.catalog}>{games.map(g=><Link href={g.href} key={g.id}>
   <GameScenery game={g.scene} className={styles.miniStage}>{g.learning?<LearningMascot kind={g.kind} size={112}/>:<GameMascot game={g.scene} size={112}/>}</GameScenery>
   <h3><span aria-label={"遊戲編號 "+g.number}>{String(g.number).padStart(2,"0")} · </span>{g.title}</h3><p>{g.info}</p><b>開始玩 ↗</b>
  </Link>)}</div>
 </section>;
}
