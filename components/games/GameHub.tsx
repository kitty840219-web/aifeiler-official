"use client";

import GameMascot from "./GameMascot";
import GameShell from "./GameShell";
import ArcadeCatalog from "./arcade/ArcadeCatalog";
import { useProgress } from "@/lib/games/progress";
import styles from "./Games.module.css";

export default function GameHub() {
  const { progress } = useProgress();
  return <GameShell spacious title="艾飛樂星光遊樂園" eyebrow="A LITTLE PLAY, A LITTLE LIGHT" description="天空越黑，星星越亮。留一點時間，陪自己玩一下。">
    <section className={styles.welcome}>
      <span aria-hidden="true" className={styles.orbit}>✦</span>
      <GameMascot game="island" size={180} alt="小艾陪你一起收集星光" />
      <p>今天，也有屬於你的光。</p><span className={styles.small}>22 個小世界，從喜歡的那一個開始。</span>
    </section>
    <div className={styles.hubStats}><div><b>{progress.stars}</b><span>收集的星光</span></div><div><b>{progress.flowers.length}</b><span>花園裡的花</span></div><div><b>{progress.catchBest}</b><span>接星星紀錄</span></div></div>
    <ArcadeCatalog />
  </GameShell>;
}
