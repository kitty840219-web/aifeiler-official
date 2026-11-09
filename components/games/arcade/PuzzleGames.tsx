"use client";

import { useEffect, useRef, useState } from "react";
import ArcadeFrame, { useRecord } from "./ArcadeFrame";
import styles from "./Arcade.module.css";

function shuffle<T>(a: T[]) { const n = [...a]; for (let i = n.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [n[i], n[j]] = [n[j], n[i]]; } return n; }
const icons = ["✦", "❀", "☾", "♡", "◇", "☀"];
function Result({ text, score, again }: { text: string; score: number; again: () => void }) { return <div className={styles.result}><h2>{text}</h2><p>本局 {score} 分</p><button className={styles.primary} onClick={again}>再玩一次</button></div>; }

export function MinesGame() {
  const [mines, setMines] = useState<number[]>([]), [open, setOpen] = useState<number[]>([]), [flags, setFlags] = useState<number[]>([]);
  const [mode, setMode] = useState(false), [phase, setPhase] = useState("ready");
  const { best, save } = useRecord("mines");
  const adjacent = (i: number) => Array.from({ length: 64 }, (_, j) => j).filter(j => j !== i && Math.abs(i % 8 - j % 8) <= 1 && Math.abs(Math.floor(i / 8) - Math.floor(j / 8)) <= 1);
  function start() { setMines([]); setOpen([]); setFlags([]); setPhase("playing"); }
  function flag(i: number) { if (phase !== "playing" || open.includes(i)) return; setFlags(f => f.includes(i) ? f.filter(n => n !== i) : f.length < 10 ? [...f, i] : f); }
  function reveal(i: number) {
    if (mode) { flag(i); return; }
    if (phase !== "playing" || open.includes(i) || flags.includes(i)) return;
    let bombs = mines;
    if (!bombs.length) { const safe = [i, ...adjacent(i)]; bombs = shuffle(Array.from({ length: 64 }, (_, j) => j).filter(j => !safe.includes(j))).slice(0, 10); setMines(bombs); }
    if (bombs.includes(i)) { setPhase("lost"); save(open.length); return; }
    const visible = new Set(open), todo = [i];
    while (todo.length) { const cell = todo.pop()!; if (visible.has(cell) || flags.includes(cell) || bombs.includes(cell)) continue; visible.add(cell); if (!adjacent(cell).some(n => bombs.includes(n))) todo.push(...adjacent(cell)); }
    setOpen([...visible]); if (visible.size === 54) { setPhase("won"); save(100); }
  }
  return <ArcadeFrame title="星光踩地雷" description="用一點推理，為每一顆星找到安全的位置。" rules={["8×8 棋盤藏有 10 顆地雷，第一次翻開的位置及周圍保證安全。", "數字表示周圍八格的地雷數量。空白格會自動展開。", "切換「插旗」標記可疑格；電腦也能按右鍵插旗。再點一次可移除。", "翻開所有 54 格安全格獲得 100 分。碰到地雷就結束，已翻開的安全格數計為分數。"]}>
    <div className={styles.scores}><span>旗幟 <b>{flags.length}/10</b></span><span>安全 <b>{open.length}/54</b></span></div>
    {phase === "ready" ? <button className={styles.primary} onClick={start}>開始探索</button> : <><div className={styles.row}><button aria-pressed={!mode} onClick={() => setMode(false)}>翻開</button><button aria-pressed={mode} onClick={() => setMode(true)}>插旗 ⚑</button></div><div className={styles.mineGrid}>{Array.from({ length: 64 }, (_, i) => {
      const visible = open.includes(i), bomb = mines.includes(i), count = adjacent(i).filter(n => mines.includes(n)).length;
      return <button key={i} onClick={() => reveal(i)} onContextMenu={e => { e.preventDefault(); flag(i); }} aria-label={`第 ${i + 1} 格${visible ? `，周圍 ${count} 顆地雷` : flags.includes(i) ? "，已插旗" : "，未翻開"}`} className={visible ? styles.revealed : ""} disabled={phase !== "playing"}>{phase === "lost" && bomb ? "💣" : visible ? count || "" : flags.includes(i) ? "⚑" : ""}</button>;
    })}</div>{phase === "won" || phase === "lost" ? <Result text={phase === "won" ? "安全小島，探索成功！" : "這次碰到地雷了。"} score={phase === "won" ? 100 : open.length} again={start} /> : <button className={styles.secondary} onClick={start}>重新開始</button>}</>}
    <p className={styles.note}>最佳 {best} 分</p>
  </ArcadeFrame>;
}

const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(b: string[]) { for (const [a,c,d] of wins) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]; return b.every(Boolean) ? "draw" : ""; }
function minimax(b: string[], turn: string): number { const w = winner(b); if (w) return w === "O" ? 1 : w === "X" ? -1 : 0; const scores = b.flatMap((v, i) => v ? [] : [minimax(b.map((n,j) => j === i ? turn : n), turn === "O" ? "X" : "O")]); return turn === "O" ? Math.max(...scores) : Math.min(...scores); }
export function TicTacToeGame() {
  const [board, setBoard] = useState<string[]>(Array(9).fill("")), [dual, setDual] = useState(false), [turn, setTurn] = useState("X");
  const { best, save } = useRecord("tic-tac-toe"); const w = winner(board);
  function start() { setBoard(Array(9).fill("")); setTurn("X"); }
  function play(i: number) {
    if (board[i] || w) return;
    const next = [...board]; next[i] = turn;
    if (!winner(next) && !dual) {
      let score = -Infinity, choice = -1;
      for (let j=0;j<9;j++) if (!next[j]) { const n = [...next]; n[j] = "O"; const s = minimax(n,"X"); if (s > score) { score = s; choice = j; } }
      if (choice >= 0) next[choice] = "O";
    }
    setBoard(next); if (dual) setTurn(turn === "X" ? "O" : "X");
    const outcome = winner(next); if (outcome) save(outcome === "draw" ? 10 : dual || outcome === "X" ? 30 : 0);
  }
  return <ArcadeFrame title="立體圈叉" description="一圈、一叉，和小艾來場腦力對決。" rules={["輪流在九宮格放入圈或叉，先連成橫線、直線或斜線者獲勝。", "單人模式由你先手，對戰電腦；也可切換為同裝置雙人輪流。", "勝利 30 分、和局 10 分。切換模式會重新開局。"]}>
    <div className={styles.row}><button aria-pressed={!dual} onClick={() => { setDual(false); start(); }}>與電腦玩</button><button aria-pressed={dual} onClick={() => { setDual(true); start(); }}>雙人輪流</button></div>
    <p className={styles.status} aria-live="polite">{w ? w === "draw" ? "平手，也是一種默契。" : `${w} 獲勝！` : dual ? `輪到 ${turn}` : "你是 X，小艾是 O"}</p>
    <div className={styles.ticGrid}>{board.map((v,i) => <button key={i} onClick={() => play(i)} disabled={!!v || !!w} aria-label={`第 ${i+1} 格${v ? `，${v}` : "，空白"}`} className={v === "O" ? styles.pink : ""}>{v}</button>)}</div><button className={styles.secondary} onClick={start}>重新開局</button><p className={styles.note}>最佳 {best} 分</p>
  </ArcadeFrame>;
}

export function TilesGame() {
  const [tiles, setTiles] = useState<{id:number;kind:number}[]>([]), [tray, setTray] = useState<number[]>([]), [phase,setPhase] = useState("ready");
  const [score,setScore] = useState(0); const {save} = useRecord("tiles");
  function start() { setTiles(shuffle(Array.from({length:36},(_,i)=>({id:i,kind:i%6}))));setTray([]);setScore(0);setPhase("playing"); }
  function pick(id:number) { if(phase!=="playing")return;const tile=tiles.find(t=>t.id===id)!;let next=[...tray,tile.kind];let points=score;if(next.filter(t=>t===tile.kind).length===3){next=next.filter(t=>t!==tile.kind);points+=30;}const remaining=tiles.filter(t=>t.id!==id);setTiles(remaining);setTray(next);setScore(points);if(!remaining.length){setPhase("won");save(points);}else if(next.length>=7){setPhase("lost");save(points);} }
  return <ArcadeFrame title="繽紛方塊樂" description="把星月花瓣收進小托盤，湊成三個，就會閃閃消失。" rules={["點選棋盤上的立體圖案方塊，放入下方托盤。", "三個相同圖案會自動消除並獲得 30 分，托盤最多放 7 個。", "清空全部 36 個方塊即過關；托盤放滿仍無法消除就結束。"]}>
    {phase==="ready"?<button className={styles.primary} onClick={start}>開始配圖案</button>:<><div className={styles.scores}><span>分數 <b>{score}</b></span><span>托盤 <b>{tray.length}/7</b></span></div><div className={styles.tileGrid}>{Array.from({length:36},(_,i)=>{const t=tiles.find(t=>t.id===i);return t?<button key={i} onClick={()=>pick(i)} disabled={phase!=="playing"} className={styles[`color${t.kind}`]} aria-label={`收集${icons[t.kind]}`}>{icons[t.kind]}</button>:<span key={i}/>;})}</div><div className={styles.tray}>{Array.from({length:7},(_,i)=><span key={i}>{tray[i]!==undefined?icons[tray[i]]:"·"}</span>)}</div>{phase!=="playing"&&<Result text={phase==="won"?"所有小圖案都回家了！":"托盤滿了，再試一次吧。"} score={score} again={start}/>}</>}
  </ArcadeFrame>;
}

const moons=["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
export function MoonGame(){
 const[board,setBoard]=useState<(number|null)[]>(Array(9).fill(null)),[hand,setHand]=useState<number[]>([]),[chosen,setChosen]=useState(0),[score,setScore]=useState(0),[phase,setPhase]=useState("ready"),[message,setMessage]=useState("");const{save}=useRecord("half-moon");
 function start(){setBoard(Array(9).fill(null));setHand(Array.from({length:3},()=>Math.floor(Math.random()*8)));setScore(0);setPhase("playing");setMessage("");}
 function place(i:number){if(phase!=="playing"||board[i]!==null)return;const value=hand[chosen];const next=[...board];next[i]=value;const neighbors=[i%3?i-1:-1,i%3<2?i+1:-1,i-3,i+3].filter(j=>j>=0&&j<9);let add=0;for(const j of neighbors){if(next[j]===value)add+=5;else if(next[j]!==null&&(next[j]!+value)%8===0)add+=10;}const points=score+add;setScore(points);setBoard(next);setHand(h=>h.map((n,j)=>j===chosen?Math.floor(Math.random()*8):n));setMessage(add?`月相連結 +${add} 分`:"種下一枚月亮，尋找下一個連結。");if(next.every(v=>v!==null)){setPhase("over");save(points);}}
 return <ArcadeFrame title="半月星牌" description="把不同月相放在一起，編織一張自己的夜空。" rules={["從三張手牌選一張，點空格放到 3×3 星盤上。", "和上下左右相同月相相鄰可得 5 分；月相編號相加為 8 的互補組合可得 10 分。新月與新月依相同月相計分。", "放滿九格後結算。手牌下方顯示月相編號，方便規劃連結。"]}>{phase==="ready"?<button className={styles.primary} onClick={start}>打開星盤</button>:<><div className={styles.scores}><span>連結分數 <b>{score}</b></span><span>已放 <b>{board.filter(v=>v!==null).length}/9</b></span></div><div className={styles.moonGrid}>{board.map((v,i)=><button key={i} onClick={()=>place(i)} disabled={v!==null||phase!=="playing"} aria-label={v===null?`放在第${i+1}格`:`月相${v}`}>{v===null?"✧":moons[v]}</button>)}</div><div className={styles.hand}>{hand.map((v,i)=><button key={i} aria-pressed={chosen===i} onClick={()=>setChosen(i)}><span>{moons[v]}</span><small>月相 {v}</small></button>)}</div><p className={styles.status} aria-live="polite">{message}</p>{phase==="over"&&<Result text="這一夜的月光，由你串起。" score={score} again={start}/>}</>}</ArcadeFrame>;
}

export function PaniGame(){
 const[board,setBoard]=useState<number[]>([]),[order,setOrder]=useState({kind:0,count:3}),[score,setScore]=useState(0),[moves,setMoves]=useState(15),[phase,setPhase]=useState("ready"),[message,setMessage]=useState("");const{save}=useRecord("pani-puri");
 function group(b:number[],i:number){const result=new Set<number>(),todo=[i],kind=b[i];while(todo.length){const n=todo.pop()!;if(result.has(n)||b[n]!==kind)continue;result.add(n);for(const j of [n%6?n-1:-1,n%6<5?n+1:-1,n-6,n+6])if(j>=0&&j<36&&!result.has(j))todo.push(j);}return[...result];}
 function newOrder(b:number[]){const g=group(b,Math.floor(Math.random()*36));return{kind:b[g[0]],count:Math.min(g.length,3)};}
 function start(){const b=Array.from({length:36},()=>Math.floor(Math.random()*4));setBoard(b);setOrder(newOrder(b));setScore(0);setMoves(15);setPhase("playing");setMessage("");}
 function serve(i:number){if(phase!=="playing")return;const g=group(board,i);if(board[i]!==order.kind||g.length<order.count){setMessage("選擇符合訂單口味、數量足夠的相鄰小吃。錯誤選擇不扣次數。");return;}const b=[...board];g.forEach(j=>b[j]=Math.floor(Math.random()*4));const points=score+g.length*10;setScore(points);setMoves(moves-1);setBoard(b);setOrder(newOrder(b));setMessage(`送出${g.length}份，+${g.length*10}分`);if(moves===1){setPhase("over");save(points);}}
 return <ArcadeFrame title="印度酥炸球小舖" description="端出一盤盤小確幸，讓每位客人帶著微笑離開。" rules={["上方訂單會指定口味與最少數量。", "點擊相同口味、上下左右相連的小吃群組，數量達標即可出餐，每份 10 分。", "成功出餐 15 次後結算；錯誤選擇不扣次數。圖案和顏色都能辨識口味。"]}>{phase==="ready"?<button className={styles.primary} onClick={start}>小舖開張</button>:<><div className={styles.order}>訂單：{["🥔","🌶️","🌿","🧀"][order.kind]} 至少 {order.count} 份</div><div className={styles.scores}><span>分數 <b>{score}</b></span><span>可出餐 <b>{moves}</b></span></div><div className={styles.tileGrid}>{board.map((v,i)=><button key={i} onClick={()=>serve(i)} disabled={phase!=="playing"} className={styles[`color${v}`]} aria-label={`第${i+1}格，${["馬鈴薯","香辣","香草","起司"][v]}`}>{["🥔","🌶️","🌿","🧀"][v]}</button>)}</div><p className={styles.status} aria-live="polite">{message}</p>{phase==="over"&&<Result text="今日小舖，暖心收攤。" score={score} again={start}/>}</>}</ArcadeFrame>;
}

export function SequenceGame(){
 const[sequence,setSequence]=useState<number[]>([]),[input,setInput]=useState(0),[lit,setLit]=useState(-1),[phase,setPhase]=useState("ready"),[sound,setSound]=useState(true);const timers=useRef<ReturnType<typeof setTimeout>[]>([]);const audio=useRef<AudioContext|null>(null);const soundRef=useRef(true);const{save}=useRecord("ocean-memory");
 useEffect(()=>()=>{timers.current.forEach(clearTimeout);void audio.current?.close();},[]);
 function tone(n:number){if(!soundRef.current)return;try{if(!audio.current)audio.current=new AudioContext();const ctx=audio.current;void ctx.resume();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type="sine";osc.frequency.value=[261.6,329.6,392,523.2][n];gain.gain.setValueAtTime(.12,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.3);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.3);}catch{/* Visual sequence remains available. */}}
 function show(seq:number[]){timers.current.forEach(clearTimeout);timers.current=[];setSequence(seq);setInput(0);setPhase("watch");seq.forEach((v,i)=>{timers.current.push(setTimeout(()=>{setLit(v);tone(v);},500+i*650));timers.current.push(setTimeout(()=>setLit(-1),900+i*650));});timers.current.push(setTimeout(()=>setPhase("input"),seq.length*650+500));}
 function start(){show([Math.floor(Math.random()*4)]);}
 function tap(i:number){if(phase!=="input")return;tone(i);setLit(i);timers.current.push(setTimeout(()=>setLit(-1),180));if(sequence[input]!==i){setPhase("over");save((sequence.length-1)*10);return;}if(input+1===sequence.length){setPhase("success");timers.current.push(setTimeout(()=>show([...sequence,Math.floor(Math.random()*4)]),900));}else setInput(input+1);}
 return <ArcadeFrame title="海洋記憶遊戲" description="聽見海洋的節奏，記住每一個閃亮的朋友。" rules={["先看海洋朋友依序亮起，再用相同順序點擊牠們。", "每過一關多一個步驟；答錯就結束，每完成一關得 10 分。", "可關閉音效，只靠亮光遊玩。手機請先開啟鈴聲並點擊開始，音效才會啟動。"]}><div className={styles.row}><button aria-pressed={sound} onClick={()=>{setSound(!sound);soundRef.current=!sound;}}>音效 {sound?"開":"關"}</button></div><p className={styles.status} aria-live="polite">{phase==="watch"?"看亮光，記住順序…":phase==="input"?`輪到你：${input+1} / ${sequence.length}`:phase==="success"?"記住了！下一關…":phase==="over"?`完成 ${sequence.length-1} 關`:"跟著海洋朋友一起奏樂。"}</p><div className={styles.oceanGrid}>{["🐳","🐙","🐢","🐠"].map((v,i)=><button key={v} onClick={()=>tap(i)} disabled={phase!=="input"} className={lit===i?styles.lit:""} aria-label={`海洋朋友${i+1}${lit===i?"亮起":""}`}>{v}</button>)}</div>{phase==="ready"||phase==="over"?<button className={styles.primary} onClick={start}>{phase==="ready"?"開始記憶挑戰":"再試一次"}</button>:<button className={styles.secondary} onClick={()=>show(sequence)}>重新看一次（本關）</button>}</ArcadeFrame>;
}
