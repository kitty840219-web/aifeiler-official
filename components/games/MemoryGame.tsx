"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/basePath";
import { updateProgress, useProgress } from "@/lib/games/progress";
import GameShell from "./GameShell";
import GameInstructions from "./GameInstructions";
import styles from "./Games.module.css";

const faces = [
  { name: "草帽小艾", src: "nav-about" }, { name: "故事小艾", src: "nav-story" },
  { name: "書寫小艾", src: "nav-works" }, { name: "星座小艾", src: "nav-horoscope" },
  { name: "塔羅小艾", src: "nav-tarot" }, { name: "商店小艾", src: "nav-shop" },
];
function deckOf(pairs: number) {
  const deck = Array.from({ length: pairs * 2 }, (_, i) => ({ id: i, face: i % pairs }));
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}
export default function MemoryGame() {
  const [pairs, setPairs] = useState(6);
  const [deck, setDeck] = useState<{ id: number; face: number }[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [reward, setReward] = useState(0);
  const lock = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { progress } = useProgress();
  const won = deck.length > 0 && matched.length === deck.length;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function start() {
    clearTimeout(timeout.current); lock.current = false;
    setDeck(deckOf(pairs)); setOpen([]); setMatched([]); setMoves(0); setSeconds(0); setReward(0); setRunning(true);
  }
  function flip(id: number) {
    if (!running || lock.current || open.includes(id) || matched.includes(id)) return;
    if (!open.length) { setOpen([id]); return; }
    const first = open[0];
    const attempt = moves + 1; setMoves(attempt); setOpen([first, id]);
    if (deck.find(c => c.id === first)?.face === deck.find(c => c.id === id)?.face) {
      const next = [...matched, first, id]; setMatched(next); setOpen([]);
      if (next.length === deck.length) {
        setRunning(false); const stars = pairs === 6 ? 12 : 8; setReward(stars);
        updateProgress(p => ({ ...p, stars: p.stars + stars, memoryBest: pairs === 6 ? (!p.memoryBest || attempt < p.memoryBest ? attempt : p.memoryBest) : p.memoryBest }));
      }
    } else {
      lock.current = true;
      timeout.current = setTimeout(() => { setOpen([]); lock.current = false; }, 850);
    }
  }
  return <GameShell title="小艾翻翻樂" eyebrow="FIND YOUR LITTLE MATCH" description="把散落的溫柔，一張一張配成對。">
    <GameInstructions game="memory" />
    <div className={styles.metrics}><div><b>{moves}</b><span>翻牌次數</span></div><div><b>{matched.length / 2} / {pairs}</b><span>已配對</span></div><div><b>{seconds}s</b><span>遊玩時間</span></div></div>
    {deck.length === 0 ? <div className={`${styles.panel} ${styles.startPanel}`}>
      <span className={styles.largeSymbol} aria-hidden="true">✿</span><h2>今天，和小艾見個面。</h2><p>每次翻開兩張卡片，找到相同的小艾。<br />全部配對，就能收集星光。</p>
      <div className={styles.choices} aria-label="選擇難度">{[4, 6].map(n => <button key={n} className={pairs === n ? styles.chosen : ""} onClick={() => setPairs(n)} aria-pressed={pairs === n}>{n === 4 ? "輕鬆 · 4 對" : "挑戰 · 6 對"}</button>)}</div>
      <button className={styles.primary} onClick={start}>開始翻牌 ✦</button>
    </div> : <>
      <div className={styles.memoryBoard} aria-label="翻牌配對遊戲">{deck.map((card, index) => {
        const visible = open.includes(card.id) || matched.includes(card.id);
        const face = faces[card.face]; const done = matched.includes(card.id);
        return <button key={card.id} onClick={() => flip(card.id)} disabled={done || !running} className={`${styles.memoryCard} ${visible ? styles.flipped : ""} ${done ? styles.matched : ""}`} aria-label={visible ? `${face.name}${done ? "，已配對" : ""}` : `翻開第 ${index + 1} 張卡片`}>
          {visible ? <Image src={asset(`/images/nav/${face.src}.webp`)} alt={face.name} fill sizes="100px" /> : <><span>✦</span><small>AIFEILER</small></>}
        </button>;
      })}</div>
      <p className={styles.status} aria-live="polite">{won ? "全部配對成功！" : matched.length ? "又找回一點溫柔，繼續吧。" : "翻開任意兩張，找出相同的小艾。"}</p>
      {won && <div className={styles.result} role="status"><span>✦ +{reward}</span><h2>每一次相遇，都有意義。</h2><p>用 {moves} 次翻牌、{seconds} 秒找齊了所有小艾。</p></div>}
      <button className={styles.secondary} onClick={start}>{won ? "再玩一次" : "重新洗牌"}</button>
    </>}
    <p className={styles.record}>六對挑戰最佳：{progress.memoryBest ? `${progress.memoryBest} 次翻牌` : "等待你的第一個紀錄"}</p>
  </GameShell>;
}
