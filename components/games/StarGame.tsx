"use client";

import GameMascot from "./GameMascot";
import { useEffect, useRef, useState } from "react";
import { updateProgress, useProgress } from "@/lib/games/progress";
import GameShell from "./GameShell";
import GameInstructions from "./GameInstructions";
import styles from "./Games.module.css";

type Drop = { id: number; x: number; y: number; cloud: boolean; speed: number };
type Frame = { drops: Drop[]; x: number; score: number; hearts: number; remaining: number };
const initial: Frame = { drops: [], x: 50, score: 0, hearts: 3, remaining: 30 };

export default function StarGame() {
  const [mode, setMode] = useState<"ready" | "playing" | "paused" | "over">("ready");
  const [frame, setFrame] = useState<Frame>(initial);
  const [reward, setReward] = useState(0);
  const modeRef = useRef(mode);
  const state = useRef<Frame>({ ...initial });
  const field = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const tickCount = useRef(0);
  const keys = useRef(new Set<string>());
  const { progress } = useProgress();
  function changeMode(next: typeof mode) { modeRef.current = next; setMode(next); }
  function finish() {
    if (modeRef.current !== "playing") return;
    changeMode("over");
    const score = state.current.score;
    const stars = Math.floor(score / 2); setReward(stars);
    updateProgress(p => ({ ...p, stars: p.stars + stars, catchBest: Math.max(p.catchBest, score) }));
  }
  function start() {
    state.current = { ...initial, drops: [] }; tickCount.current = 0; nextId.current = 0; keys.current.clear();
    setFrame({ ...state.current }); setReward(0); changeMode("playing");
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key) || modeRef.current !== "playing") return;
      e.preventDefault(); keys.current.add(e.key);
    };
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.key);
    const pause = () => {
      keys.current.clear();
      if (modeRef.current === "playing") { modeRef.current = "paused"; setMode("paused"); }
    };
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onUp); window.addEventListener("blur", pause); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onUp); window.removeEventListener("blur", pause); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (mode !== "playing") return;
    let last = performance.now();
    const timer = setInterval(() => {
      if (modeRef.current !== "playing") return;
      const now = performance.now(); const dt = Math.min((now - last) / 1000, .15); last = now;
      const s = state.current;
      s.remaining = Math.max(0, s.remaining - dt);
      if (keys.current.has("ArrowLeft")) s.x = Math.max(18, s.x - 85 * dt);
      if (keys.current.has("ArrowRight")) s.x = Math.min(82, s.x + 85 * dt);
      tickCount.current += dt;
      if (tickCount.current >= .6) {
        tickCount.current = 0;
        s.drops.push({ id: nextId.current++, x: 12 + Math.random() * 76, y: -7, cloud: Math.random() < .23, speed: 20 + (30 - s.remaining) * .45 + Math.random() * 7 });
      }
      s.drops = s.drops.filter(drop => {
        const previous = drop.y; drop.y += drop.speed * dt;
        if (previous < 81 && drop.y >= 81 && Math.abs(drop.x - s.x) < 14) {
          if (drop.cloud) s.hearts = Math.max(0, s.hearts - 1); else s.score++;
          return false;
        }
        return drop.y < 104;
      });
      setFrame({ ...s, drops: [...s.drops] });
      if (s.remaining <= 0 || s.hearts <= 0) {
        modeRef.current = "over"; setMode("over");
        const stars = Math.floor(s.score / 2); setReward(stars);
        updateProgress(p => ({ ...p, stars: p.stars + stars, catchBest: Math.max(p.catchBest, s.score) }));
      }
    }, 40);
    return () => clearInterval(timer);
  }, [mode]);
  function move(clientX: number) {
    if (modeRef.current !== "playing" || !field.current) return;
    const r = field.current.getBoundingClientRect();
    state.current.x = Math.max(18, Math.min(82, (clientX - r.left) / r.width * 100));
  }
  return <GameShell title="星光接接樂" eyebrow="CATCH A LITTLE LIGHT" description="接住星光，躲開烏雲。黑夜裡，你也可以發光。">
    <GameInstructions game="stars" />
    <div className={styles.metrics}><div><b>{frame.score}</b><span>接到的星星</span></div><div><b>{Math.ceil(frame.remaining)}s</b><span>剩餘時間</span></div><div><b aria-label={`${frame.hearts} 顆愛心`}>{"♥".repeat(frame.hearts)}{"♡".repeat(3 - frame.hearts)}</b><span>溫柔能量</span></div></div>
    <div className={styles.starField} ref={field} aria-label="接星星遊戲區，拖曳或用左右方向鍵移動小艾"
      onPointerDown={e => { if (modeRef.current === "playing") { e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); } }}
      onPointerMove={e => { if (e.pointerType === "mouse" || e.buttons) move(e.clientX); }}>
      <span className={styles.moon} aria-hidden="true">☾</span><div className={styles.nightWords} aria-hidden="true">天空越黑<br />星星越亮</div>
      {frame.drops.map(drop => <span key={drop.id} className={`${styles.drop} ${drop.cloud ? styles.cloud : ""}`} style={{ left: `${drop.x}%`, top: `${drop.y}%` }} aria-hidden="true">{drop.cloud ? "☁" : "✦"}</span>)}
      <div className={styles.catcher} style={{ left: `${frame.x}%` }}><GameMascot game="stars" size={96} alt="接星星的小艾" /></div>
      {mode !== "playing" && <div className={styles.fieldOverlay}>
        {mode === "ready" ? <><span>✦</span><h2>準備好接住星光了嗎？</h2><p>拖曳小艾或使用左右方向鍵。<br />星星 +1，烏雲扣一顆愛心。<br />挑戰 30 秒，每 2 顆星換 1 點星光。</p><button className={styles.primary} onClick={start}>開始挑戰</button></> : mode === "paused" ? <><h2>休息一下也很好。</h2><p>時間已暫停，準備好再繼續。</p><button className={styles.primary} onClick={() => changeMode("playing")}>繼續接星星</button></> : <><span>✦ +{reward}</span><h2>你接住了 {frame.score} 顆星。</h2><p>每一點微光，都值得被珍惜。</p><button className={styles.primary} onClick={start}>再挑戰一次</button></>}
      </div>}
    </div>
    <div className={styles.actionRow}>{mode === "playing" && <><button className={styles.secondary} onClick={() => changeMode("paused")}>暫停</button><button className={styles.textButton} onClick={finish}>結束這次挑戰</button></>}{mode === "paused" && <button className={styles.secondary} onClick={start}>重新開始</button>}</div>
    <p className={styles.record}>最佳紀錄 ✦ {progress.catchBest} 顆星星</p>
  </GameShell>;
}
