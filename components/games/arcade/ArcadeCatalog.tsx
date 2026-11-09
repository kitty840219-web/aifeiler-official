import Link from "next/link";
import { ARCADE_GAMES } from "@/lib/games/catalog";
import styles from "./Arcade.module.css";

export default function ArcadeCatalog() {
  return <section className={styles.catalogSection} aria-labelledby="arcade-catalog-title">
    <p className={styles.catalogLabel}>LITTLE CLASSICS · BIG DIMENSIONS</p><h2 id="arcade-catalog-title">立體遊戲館</h2><p>熟悉的玩法，換上艾飛樂的小小世界。</p>
    <div className={styles.catalog}>{ARCADE_GAMES.map(g => <Link href={`/games/${g.slug}`} key={g.slug}><div className={styles.miniStage}><span aria-hidden="true">{g.icon}</span></div><h3>{g.title}</h3><p>{g.category}</p><b>開始玩 ↗</b></Link>)}</div>
  </section>;
}
