"use client";

import { useEffect, useRef, useState } from "react";
import ArcadeFrame, { useRecord } from "./ArcadeFrame";
import styles from "./Arcade.module.css";

const N = 16;
type Point = { x: number; y: number };
type State = { body: Point[]; food: Point; direction: Point; score: number };
const initial: State = { body: [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }], food: { x: 11, y: 8 }, direction: { x: 1, y: 0 }, score: 0 };
const directions: Record<string, Point> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };

export default function SnakeGame() {
  const [state, setState] = useState(initial);
  const live = useRef<State>(initial);
  const queued = useRef<Point | null>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "paused" | "over" | "won">("ready");
  const phaseRef = useRef(phase);
  const [speed, setSpeed] = useState(170);
  const pointer = useRef<Point | null>(null);
  const { best, save } = useRecord("snake");
  const saveRef = useRef(save);
  useEffect(() => { saveRef.current = save; }, [save]);
  function mode(next: typeof phase) { phaseRef.current = next; setPhase(next); }
  function turn(key: string) {
    const d = directions[key]; const current = live.current.direction;
    if (phaseRef.current !== "playing" || !d || queued.current || (d.x === -current.x && d.y === -current.y)) return;
    queued.current = d;
  }
  function start() { const next = { ...initial, body: initial.body.map(p => ({ ...p })) }; live.current = next; queued.current = null; setState(next); mode("playing"); }
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (directions[e.key] && phaseRef.current === "playing") { e.preventDefault(); const d = directions[e.key]; const current = live.current.direction; if (!queued.current && !(d.x === -current.x && d.y === -current.y)) queued.current = d; } };
    const blur = () => { if (phaseRef.current === "playing") { phaseRef.current = "paused"; setPhase("paused"); } };
    const visibility = () => { if (document.hidden) blur(); };
    window.addEventListener("keydown", key); window.addEventListener("blur", blur); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("blur", blur); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      if (phaseRef.current !== "playing") return;
      const s = live.current; const d = queued.current || s.direction; queued.current = null;
      const head = { x: s.body[0].x + d.x, y: s.body[0].y + d.y };
      const eat = head.x === s.food.x && head.y === s.food.y;
      const collisionBody = eat ? s.body : s.body.slice(0, -1);
      if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N || collisionBody.some(p => p.x === head.x && p.y === head.y)) {
        phaseRef.current = "over"; setPhase("over"); saveRef.current(s.score); return;
      }
      const body = [head, ...s.body]; if (!eat) body.pop();
      let food = s.food;
      if (eat) {
        const free: Point[] = [];
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!body.some(p => p.x === x && p.y === y)) free.push({ x, y });
        if (free.length) food = free[Math.floor(Math.random() * free.length)];
        else { phaseRef.current = "won"; setPhase("won"); saveRef.current(s.score + 5); }
      }
      const next = { body, food, direction: d, score: s.score + (eat ? 5 : 0) }; live.current = next; setState(next);
    }, speed);
    return () => clearInterval(timer);
  }, [phase, speed]);
  return <ArcadeFrame title="小艾貪食蛇" description="在奶油色的小島上，吃下蘋果，一點點長大。" rules={["按開始後，以方向鍵、下方按鈕或在棋盤滑動改變方向。", "每吃一顆蘋果加 5 分，身體會變長；不能直接往反方向轉彎。", "碰到邊界或自己的身體就結束。可以暫停；離開視窗也會自動暫停。", "挑戰高分並收集星光，選擇慢速可以更輕鬆地練習。"]}>
    <div className={styles.scores}><span>本局 <b>{state.score}</b></span><span>最佳 <b>{best}</b></span></div>
    <div className={styles.board3d} onPointerDown={e => { if(phaseRef.current!=="playing")return; pointer.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={e => { if (!pointer.current) return; const dx = e.clientX - pointer.current.x, dy = e.clientY - pointer.current.y; pointer.current = null; if (Math.max(Math.abs(dx), Math.abs(dy)) > 12) turn(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "ArrowRight" : "ArrowLeft" : dy > 0 ? "ArrowDown" : "ArrowUp"); }}>
      <svg className={styles.snakeSvg} viewBox="0 0 320 320" role="img" aria-label={`貪食蛇棋盤，目前 ${state.score} 分`}>
        <defs><radialGradient id="snakeBody" cx="30%" cy="20%"><stop stopColor="#d5f0a6"/><stop offset="1" stopColor="#599b6f"/></radialGradient><radialGradient id="snakeApple" cx="30%" cy="20%"><stop stopColor="#ffbd9d"/><stop offset="1" stopColor="#d55b61"/></radialGradient></defs>
        <rect width="320" height="320" rx="12" fill="#ecedcf"/>
        {Array.from({ length: N * N }, (_, i) => <rect key={i} x={i % N * 20} y={Math.floor(i / N) * 20} width="20" height="20" fill={(i % N + Math.floor(i / N)) % 2 ? "#e2e6c1" : "#edf0d2"} />)}
        <ellipse cx={state.food.x * 20 + 11} cy={state.food.y * 20 + 17} rx="8" ry="3" fill="#9a834855"/><circle cx={state.food.x * 20 + 10} cy={state.food.y * 20 + 9} r="8" fill="url(#snakeApple)"/><path d={`M${state.food.x * 20 + 10} ${state.food.y * 20 + 3}q0 -5 4 -5`} stroke="#678349" strokeWidth="2" fill="none"/>
        {[...state.body].reverse().map((p, i) => <g key={i}><ellipse cx={p.x * 20 + 10} cy={p.y * 20 + 18} rx="9" ry="3" fill="#526b4555"/><rect x={p.x * 20 + 1} y={p.y * 20 + 1} width="18" height="18" rx="7" fill="url(#snakeBody)" stroke="#4f8863" strokeWidth=".5"/></g>)}
        <g fill="#34314b"><circle cx={state.body[0].x * 20 + 6} cy={state.body[0].y * 20 + 6} r="2"/><circle cx={state.body[0].x * 20 + 14} cy={state.body[0].y * 20 + 6} r="2"/></g>
      </svg>
      {phase !== "playing" && <div className={styles.overlay}><span className={styles.heroIcon}>🍎</span><h2>{phase === "ready" ? "吃一顆，好心情。" : phase === "paused" ? "先休息一下。" : phase === "won" ? "小島都被你填滿了！" : "每一步，都讓你長大。"}</h2><p>{phase === "over" || phase === "won" ? `這次獲得 ${state.score} 分` : "準備好，開始一場立體小冒險。"}</p>{phase === "ready" && <div className={styles.row}><button onClick={() => setSpeed(230)} aria-pressed={speed === 230}>慢速</button><button onClick={() => setSpeed(170)} aria-pressed={speed === 170}>一般</button><button onClick={() => setSpeed(110)} aria-pressed={speed === 110}>快速</button></div>}<button className={styles.primary} onClick={() => phase === "paused" ? mode("playing") : start()}>{phase === "ready" ? "開始遊戲" : phase === "paused" ? "繼續遊戲" : "再玩一次"}</button></div>}
    </div>
    <div className={styles.dpad} aria-label="移動方向"><button onClick={() => turn("ArrowUp")} aria-label="往上">↑</button><div><button onClick={() => turn("ArrowLeft")} aria-label="往左">←</button><button onClick={() => turn("ArrowDown")} aria-label="往下">↓</button><button onClick={() => turn("ArrowRight")} aria-label="往右">→</button></div></div>
    {phase === "playing" && <button className={styles.secondary} onClick={() => mode("paused")}>暫停</button>}
  </ArcadeFrame>;
}
