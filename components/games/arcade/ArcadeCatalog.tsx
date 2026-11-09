import Link from "next/link";
import { ARCADE_GAMES } from "@/lib/games/catalog";
import styles from "./Arcade.module.css";
import GameMascot from "../GameMascot";
import GameScenery from "../GameScenery";
export default function ArcadeCatalog() {
 return <section className={styles.catalogSection} aria-labelledby="arcade-catalog-title">
  <p className={styles.catalogLabel}>AIFEILER · LITTLE GAME COLLECTION</p><h2 id="arcade-catalog-title">一起玩遊戲</h2><p>選一個喜歡的小世界，收集屬於你的光。</p>
  <div className={styles.catalog}>{ARCADE_GAMES.map(g=><Link href={`/games/${g.slug}`} key={g.slug}>
   <GameScenery game={g.slug} className={styles.miniStage}><GameMascot game={g.slug} size={112} /></GameScenery>
   <h3>{g.title}</h3><p>{g.category}</p><b>開始玩 ↗</b>
  </Link>)}</div>
 </section>;
}
