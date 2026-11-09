"use client";

import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/basePath";
import GameShell from "./GameShell";
import ArcadeCatalog from "./arcade/ArcadeCatalog";
import { useProgress } from "@/lib/games/progress";
import styles from "./Games.module.css";

const games = [
  { href: "/games/memory", title: "小艾翻翻樂", label: "01 / MEMORY", image: "/images/nav/nav-about.webp", desc: "翻開一張溫柔，找到另一半共鳴。", badge: "記憶配對", art: "✿", color: "peach" },
  { href: "/games/stars", title: "星光接接樂", label: "02 / STAR CATCHER", image: "/images/nav/nav-horoscope.webp", desc: "接住墜落的星光，讓黑夜亮起來。", badge: "30 秒挑戰", art: "✦", color: "violet" },
  { href: "/games/garden", title: "小艾的心情花園", label: "03 / MOOD GARDEN", image: "/images/nav/nav-works.webp", desc: "把今天的心情，種成一朵小小的花。", badge: "每日療癒", art: "❀", color: "green" },
];

export default function GameHub() {
  const { progress } = useProgress();
  return <GameShell spacious title="艾飛樂星光遊樂園" eyebrow="A LITTLE PLAY, A LITTLE LIGHT" description="天空越黑，星星越亮。留一點時間，陪自己玩一下。">
    <section className={styles.welcome}>
      <span aria-hidden="true" className={styles.orbit}>✦</span>
      <Image src={asset("/images/latest-articles-cutout.webp")} width={180} height={180} alt="小艾陪你一起收集星光" priority />
      <p>今天，也有屬於你的光。</p><span className={styles.small}>三個小世界，從喜歡的那一個開始。</span>
    </section>
    <div className={styles.hubStats}><div><b>{progress.stars}</b><span>收集的星光</span></div><div><b>{progress.flowers.length}</b><span>花園裡的花</span></div><div><b>{progress.catchBest}</b><span>接星星紀錄</span></div></div>
    <div className={styles.gameList}>{games.map(g => <Link className={`${styles.gameCard} ${styles[g.color]}`} href={g.href} key={g.href}>
      <div className={styles.cardArt}><span aria-hidden="true">{g.art}</span><Image src={asset(g.image)} alt="" width={96} height={96} /></div>
      <div className={styles.cardText}><p className={styles.eyebrow}>{g.label}</p><h2>{g.title}</h2><p>{g.desc}</p><div className={styles.cardBottom}><span>{g.badge}</span><b>開始玩 ↗</b></div></div>
    </Link>)}</div>
    <ArcadeCatalog />
  </GameShell>;
}
