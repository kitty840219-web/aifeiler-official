"use client";

import GameMascot from "./GameMascot";
import Link from "next/link";
import GameShell from "./GameShell";
import ArcadeCatalog from "./arcade/ArcadeCatalog";
import styles from "./Games.module.css";

export default function GameHub() {
  return <GameShell spacious title="艾飛樂星光遊樂園" eyebrow="A LITTLE PLAY, A LITTLE LIGHT" description="天空越黑，星星越亮。留一點時間，陪自己玩一下。">
    <section className={`${styles.welcome} ${styles.welcomePicture}`}>
      <span aria-hidden="true" className={styles.orbit}>✦</span>
      <GameMascot game="island" size={240} alt="小艾陪你一起收集星光" />
    </section>
    <div className={styles.welcomeCopy}><p>今天，也有屬於你的光。</p><span>22 個小世界，從喜歡的那一個開始。</span></div>
    <Link href="/learn" className={styles.learningEntry}>小艾語言學習館・國文與英文 →</Link>
    <ArcadeCatalog />
  </GameShell>;
}
