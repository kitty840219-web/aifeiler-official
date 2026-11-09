"use client";

import { useState } from "react";
import { today, updateProgress, useProgress } from "@/lib/games/progress";
import GameShell from "./GameShell";
import GameInstructions from "./GameInstructions";
import styles from "./Games.module.css";
import GameMascot from "./GameMascot";

const moods = [ { name: "開心", icon: "☀", note: "把今天的快樂，收進花瓣裡。" }, { name: "平靜", icon: "☾", note: "慢慢來，安靜也是一種力量。" }, { name: "疲憊", icon: "☁", note: "你不必一直很厲害，今天也可以休息。" }, { name: "低落", icon: "☂", note: "花不會每天盛開，你也不需要。" }, { name: "期待", icon: "✦", note: "還沒發生的美好，正在慢慢靠近。" } ];
const seeds = [{ kind: "daisy", name: "溫柔雛菊", icon: "🌼", cost: 0 }, { kind: "tulip", name: "勇氣鬱金香", icon: "🌷", cost: 5 }, { kind: "sunflower", name: "希望向日葵", icon: "🌻", cost: 8 }];
const decorations = [{ id: "moon", icon: "☾", name: "月光", required: 0 }, { id: "ribbon", icon: "🎀", name: "緞帶", required: 3 }, { id: "butterfly", icon: "🦋", name: "蝴蝶", required: 7 }];
export default function GardenGame() {
  const { progress, ready } = useProgress();
  const [mood, setMood] = useState("平靜");
  const [seed, setSeed] = useState("daisy");
  const [message, setMessage] = useState("");
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const day = today();
  const planted = progress.lastGardenDay === day;
  const moodInfo = moods.find(m => m.name === mood)!;
  const selected = progress.flowers.find(f => f.id === selectedFlower);
  const decoration = decorations.find(d => d.id === progress.decoration) || decorations[0];
  function plant() {
    if (!ready) return;
    const chosen = seeds.find(s => s.kind === seed)!;
    updateProgress(p => {
      if (p.lastGardenDay === day) { setMessage("今天的心情已經種下了，明天再一起種花。 "); return p; }
      if (p.stars < chosen.cost) { setMessage("星光還不夠，先選免費雛菊，或到其他遊戲收集星光。 "); return p; }
      setMessage(`${chosen.name}已種下，送你 3 點星光。${moodInfo.note}`);
      return { ...p, stars: p.stars - chosen.cost + 3, lastGardenDay: day, flowers: [...p.flowers, { id: `${day}-${Date.now()}`, kind: seed, mood, day }].slice(-24) };
    });
  }
  return <GameShell title="小艾的心情花園" eyebrow="LET YOUR FEELINGS BLOOM" description="不必急著變好，先讓今天的心情，有個可以停留的地方。">
    <GameInstructions game="garden" />
    <div className={styles.gardenScene}>
      <div style={{textAlign:"center",padding:"12px 0"}}><GameMascot game="garden" size={140} alt="正在澆花的女孩" /></div>
      <div className={styles.gardenSky}><span>MY LITTLE GARDEN</span><b aria-label={decoration.name}>{decoration.icon}</b></div>
      <div className={styles.flowerBeds} aria-label="我的心情花園">{Array.from({ length: 12 }, (_, i) => {
        const flower = progress.flowers.slice(-12)[i];
        return flower ? <button key={flower.id} className={styles.flowerPlot} aria-label={`${flower.day}，${flower.mood}，${seeds.find(s => s.kind === flower.kind)?.name}`} onClick={() => setSelectedFlower(flower.id)}><span>{seeds.find(s => s.kind === flower.kind)?.icon}</span><small>{flower.day.slice(5)}</small></button> : <span key={`empty-${i}`} className={styles.emptyPlot} aria-label="等待花開">·</span>;
      })}</div>
      <p className={styles.gardenCaption}>{progress.flowers.length ? `已收藏 ${progress.flowers.length} 次心情 · 展示最近 12 朵花` : "第一朵花，從今天的你開始。"}</p>
    </div>
    {selected && <div className={styles.flowerNote} role="status"><b>{selected.day} · {selected.mood}</b><p>{moods.find(m => m.name === selected.mood)?.note}</p><button className={styles.textButton} onClick={() => setSelectedFlower(null)}>收起回憶</button></div>}
    <section className={styles.panel}>
      <p className={styles.eyebrow}>01 / TODAY’S FEELING</p><h2>今天的你，還好嗎？</h2>
      <div className={styles.moods}>{moods.map(m => <button key={m.name} onClick={() => setMood(m.name)} className={mood === m.name ? styles.chosen : ""} aria-pressed={mood === m.name}><span>{m.icon}</span>{m.name}</button>)}</div>
      <p className={styles.gentle} aria-live="polite">{moodInfo.note}</p>
      <p className={styles.eyebrow}>02 / PICK A LITTLE SEED</p><h2>選一朵花，送給自己。</h2>
      <div className={styles.seedChoices}>{seeds.map(s => <button key={s.kind} onClick={() => setSeed(s.kind)} aria-pressed={seed === s.kind} className={seed === s.kind ? styles.chosen : ""}><span>{s.icon}</span><b>{s.name}</b><small>{s.cost ? `✦ ${s.cost}` : "免費種下"}</small></button>)}</div>
      <button className={styles.primary} onClick={plant} disabled={!ready || planted}>{planted ? "今天已種下，明天再見" : "種下今天的心情 +3 ✦"}</button>
      <p className={styles.status} aria-live="polite">{message || "每天可以種一朵花，以這台裝置的當地日期計算。"}</p>
    </section>
    <section className={styles.panel}><p className={styles.eyebrow}>LITTLE THINGS, BIG JOY</p><h2>裝飾你的花園</h2><div className={styles.decorations}>{decorations.map(d => <button key={d.id} disabled={!ready || progress.flowers.length < d.required} aria-pressed={progress.decoration === d.id} className={progress.decoration === d.id ? styles.chosen : ""} onClick={() => updateProgress(p => ({ ...p, decoration: d.id }))}><span>{d.icon}</span><b>{d.name}</b><small>{progress.flowers.length >= d.required ? "已解鎖" : `種 ${d.required} 朵花解鎖`}</small></button>)}</div></section>
  </GameShell>;
}
