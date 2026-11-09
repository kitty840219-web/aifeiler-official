"use client";

import { useEffect, useRef, useState } from "react";
import ArcadeFrame, { useRecord } from "./ArcadeFrame";
import ActionEngine, { ACTION_INFO, type ActionKind } from "./actionEngine";
import styles from "./Arcade.module.css";
import GameMascot from "../GameMascot";
import { GAME_ART } from "@/lib/games/art";
import { asset } from "@/lib/basePath";
import { BACKGROUND_ART } from "@/lib/games/backgrounds";
import {gameNotice,gameResult} from "@/lib/games/feedback";
import {useGameRestart} from "../useGameRestart";

type Mode="ready"|"playing"|"paused"|"over"|"editing";
type Hud={score:number;health:number;time:number;message:string;count:number;roundDone:boolean;cooldown:number;won:boolean;medals:number;coins:number};
const empty:Hud={score:0,health:3,time:0,message:"",count:0,roundDone:false,cooldown:0,won:false,medals:0,coins:0};
export default function ActionGame({game}:{game:ActionKind}){
 const info=ACTION_INFO[game];const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<ActionEngine|null>(null),phase=useRef<Mode>("ready"),pointer=useRef<{x:number;y:number}|null>(null);
 const[mode,setMode]=useState<Mode>("ready"),[hud,setHud]=useState<Hud>(empty),[dual,setDual]=useState(false),[aim,setAim]=useState(50),[power,setPower]=useState(60),[angle,setAngle]=useState(45),[tool,setTool]=useState(1);
 const artImage=useRef<HTMLImageElement|null>(null),backgroundImage=useRef<HTMLImageElement|null>(null);
 const custom=useRef<number[][]|null>(null);const{best,save}=useRecord(game);const saveRef=useRef(save);useEffect(()=>{saveRef.current=save;},[save]);
 function change(next:Mode){phase.current=next;setMode(next);}
 function start(){const model=new ActionEngine(game,{dual,custom:custom.current||undefined});model.art=artImage.current;model.background=backgroundImage.current;model.reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;model.aim=aim;model.power=power;model.angle=angle;engine.current=model;setHud(empty);change("playing");}
 useGameRestart(game,start);
 function action(){engine.current?.act();}
 useEffect(()=>{
  const ctx=canvas.current?.getContext("2d");if(!ctx)return;
  if(game==="platform"){try{const raw=JSON.parse(localStorage.getItem("aifeiler-custom-level")||"null");if(Array.isArray(raw)&&raw.length===20&&raw.every(r=>Array.isArray(r)&&r.length===18&&r.every(v=>Number.isInteger(v)&&v>=0&&v<=4)))custom.current=raw;}catch{/* Use default level. */}}
  engine.current=new ActionEngine(game,{custom:custom.current||undefined});
  const image=new window.Image(); let active=true; image.onload=()=>{if(!active)return;artImage.current=image;if(engine.current)engine.current.art=image;};image.src=asset(GAME_ART[game].src);
  const background=new window.Image();background.onload=()=>{if(!active)return;backgroundImage.current=background;if(engine.current)engine.current.background=background;};background.src=asset(BACKGROUND_ART[game].src);
  let frame=0,last=performance.now(),lastHud=0;
  const loop=(now:number)=>{const dt=Math.min((now-last)/1000,.04);last=now;const model=engine.current;if(model){if(phase.current==="playing"){model.step(dt);const notices=model.notices.splice(0);if(!model.finished)for(const notice of notices)gameNotice(game,notice.kind,notice.message,notice.points);if(model.finished){phase.current="over";setMode("over");saveRef.current(model.score);gameResult(game,{score:model.score,outcome:model.won?"win":model.health<=0?"over":"complete",message:model.won?"完成挑戰，太棒了！":model.health<=0?model.feedbackReason||"機會用完了，再挑戰一次！":["pony","popcorn","halloween"].includes(game)?"時間到了，看看這次成績！":"本局完成，看看你的成績！"});}}if(phase.current!=="paused"&&phase.current!=="editing")model.advanceEffects(dt);model.draw(ctx);if(now-lastHud>120){lastHud=now;setHud({score:model.score,health:model.health,time:model.time,message:model.message,count:model.count,roundDone:model.roundDone,cooldown:model.cooldown,won:model.won,medals:model.medals.filter(Boolean).length,coins:model.coins});}}frame=requestAnimationFrame(loop);};frame=requestAnimationFrame(loop);
  const key=(e:KeyboardEvent)=>{if(phase.current!=="playing"||!(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","a","d"].includes(e.key)))return;e.preventDefault();if(!e.repeat||["ArrowLeft","ArrowRight","a","d"].includes(e.key))engine.current?.command(e.key,true);};
  const up=(e:KeyboardEvent)=>engine.current?.command(e.key,false);
  const pause=()=>{engine.current?.keys.clear();if(phase.current==="playing"){phase.current="paused";setMode("paused");}};
  const visibility=()=>{if(document.hidden)pause();};
  window.addEventListener("keydown",key);window.addEventListener("keyup",up);window.addEventListener("blur",pause);document.addEventListener("visibilitychange",visibility);
  return()=>{active=false;image.onload=null;background.onload=null;cancelAnimationFrame(frame);window.removeEventListener("keydown",key);window.removeEventListener("keyup",up);window.removeEventListener("blur",pause);document.removeEventListener("visibilitychange",visibility);};
 },[game]);
 function coords(e:React.PointerEvent<HTMLCanvasElement>){const r=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*360,y:(e.clientY-r.top)/r.height*440};}
 function paint(x:number,y:number){const m=engine.current;if(!m)return;const col=Math.floor(x/20),row=Math.floor((y-20)/20);if(col<0||col>=18||row<0||row>=20)return;if(tool===4)m.grid=m.grid.map(r=>r.map(v=>v===4?0:v));m.grid[row][col]=tool;}
 function saveLevel(){const m=engine.current;if(!m)return;if(!m.grid.flat().includes(4)){setHud(h=>({...h,message:"請先放一面旗幟作為終點。"}));return;}custom.current=m.grid.map(r=>[...r]);try{localStorage.setItem("aifeiler-custom-level",JSON.stringify(custom.current));}catch{/* Play in this session. */}start();}
 function direction(key:string){engine.current?.command(key);}
 const showDirections=["maze","pony","popcorn","platform","island","halloween"].includes(game);
 const timeLimit=game==="pony"?60:["popcorn","halloween"].includes(game)?45:0;
 const actionLabel=game==="petanque"&&hud.roundDone?"下一回合":game==="gnomes"&&hud.count>=3?"結算":info.action;
 return <ArcadeFrame title={info.title} description={info.description} rules={info.rules}>
  <div className={styles.scores}><span>分數 <b>{hud.score}</b></span><span>{timeLimit?"剩餘":"能量"} <b>{timeLimit?`${Math.max(0,Math.ceil(timeLimit-hud.time))}s`:game==="petanque"?`${hud.roundDone?"回合結束":"拋投中"}`:"♥".repeat(Math.min(6,Math.max(0,hud.health)))}</b></span></div>
  {game==="popcorn"&&mode==="ready"&&<div className={styles.row}><button aria-pressed={!dual} onClick={()=>setDual(false)}>單人</button><button aria-pressed={dual} onClick={()=>setDual(true)}>同裝置雙人</button></div>}
  <p className={styles.touchHint}>可直接點遊戲畫面操作，原有按鈕與鍵盤也能繼續使用。</p>
  <div className={styles.canvasStage}>
   <canvas ref={canvas} width={360} height={440} aria-label={`${info.title}互動遊戲畫面`} onPointerDown={e=>{const p=coords(e);if(phase.current==="editing"){paint(p.x,p.y);return;}if(phase.current!=="playing")return;pointer.current=p;e.currentTarget.setPointerCapture(e.pointerId);if(!["maze","halloween"].includes(game))engine.current?.pointer(p.x,p.y);}} onPointerMove={e=>{if(phase.current!=="playing"||!pointer.current)return;const p=coords(e);if(!["maze","halloween"].includes(game))engine.current?.pointer(p.x,p.y);}} onPointerUp={e=>{if(phase.current!=="playing"||!pointer.current)return;const p=coords(e),dx=p.x-pointer.current.x,dy=p.y-pointer.current.y;pointer.current=null;if(["maze","halloween"].includes(game)&&Math.max(Math.abs(dx),Math.abs(dy))>10)direction(Math.abs(dx)>Math.abs(dy)?dx>0?"ArrowRight":"ArrowLeft":dy>0?"ArrowDown":"ArrowUp");else if(Math.max(Math.abs(dx),Math.abs(dy))<=10){const m=engine.current;m?.tap(p.x,p.y);if(m&&game==="gnomes")setAngle(Math.round(m.angle));if(m&&game==="petanque"){setAim(Math.round(m.aim));setPower(Math.round(m.power));}}}} onPointerCancel={()=>{pointer.current=null;}}/>
   {["ready","paused","over"].includes(mode)&&<div className={styles.overlay}><GameMascot game={game} size={112} alt={`${info.title}角色`} /><h2>{mode==="ready"?info.title:mode==="paused"?"休息一下，再出發。":hud.won?"完成挑戰！":"每次練習，都有進步。"}</h2><p>{mode==="over"?`本局 ${hud.score} 分 · 最佳 ${Math.max(best,hud.score)} 分`:mode==="paused"?"遊戲已暫停，計時也會停下。":"立體小世界，等你來探索。"}</p><button className={styles.primary} onClick={()=>mode==="paused"?change("playing"):start()}>{mode==="ready"?"開始遊戲":mode==="paused"?"繼續遊戲":"再玩一次"}</button></div>}
  </div>
  {(game==="gnomes"||game==="petanque")&&<div className={styles.sliders}>
   {game==="gnomes"?<label>發射角度 {angle}°<input type="range" min="25" max="70" value={angle} onChange={e=>{const v=Number(e.target.value);setAngle(v);if(engine.current)engine.current.angle=v;}}/></label>:<><label>左右瞄準 {aim}<input type="range" min="0" max="100" value={aim} onChange={e=>{const v=Number(e.target.value);setAim(v);if(engine.current)engine.current.aim=v;}}/></label><label>力量 {power}%<input type="range" min="10" max="100" value={power} onChange={e=>{const v=Number(e.target.value);setPower(v);if(engine.current)engine.current.power=v;}}/></label></>}
  </div>}
  {mode==="playing"&&actionLabel&&<button className={styles.primary} onClick={action}>{actionLabel}{game==="popcorn"&&hud.cooldown>0?`（冷卻 ${Math.ceil(hud.cooldown)}s）`:""}</button>}
  {mode==="playing"&&showDirections&&<div className={styles.dpad}><button aria-label="向上" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);direction("ArrowUp");}} onPointerUp={()=>engine.current?.command("ArrowUp",false)}>↑</button><div>{[["ArrowLeft","←"],["ArrowDown","↓"],["ArrowRight","→"]].map(([key,label])=><button key={key} aria-label={key==="ArrowLeft"?"向左":key==="ArrowDown"?"向下":"向右"} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);direction(key);}} onPointerUp={()=>engine.current?.command(key,false)} onPointerCancel={()=>engine.current?.command(key,false)}>{label}</button>)}</div></div>}
  {game==="popcorn"&&dual&&mode==="playing"&&<div className={styles.row}><span>1P</span>{[["a","←"],["d","→"]].map(([key,label])=><button key={key} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);direction(key);}} onPointerUp={()=>engine.current?.command(key,false)} onPointerCancel={()=>engine.current?.command(key,false)}>{label}</button>)}</div>}
  {mode==="playing"&&<button className={styles.secondary} onClick={()=>{engine.current?.keys.clear();change("paused");}}>暫停</button>}
  {game==="platform"&&["ready","paused","over","editing"].includes(mode)&&<div className={styles.editor}>{mode!=="editing"?<button className={styles.secondary} onClick={()=>{const m=engine.current;if(m){m.edit=true;change("editing");}}}>編輯關卡</button>:<><div className={styles.row}>{[[0,"橡皮擦"],[1,"方塊"],[2,"星星"],[3,"尖刺"],[4,"旗幟"]].map(([v,n])=><button key={v} aria-pressed={tool===v} onClick={()=>setTool(Number(v))}>{n}</button>)}</div><p>選工具，點格子擺放。放置完成後試玩。</p><div className={styles.row}><button onClick={saveLevel}>儲存並試玩</button><button onClick={()=>{custom.current=null;try{localStorage.removeItem("aifeiler-custom-level");}catch{}engine.current=new ActionEngine(game);engine.current.art=artImage.current;engine.current.background=backgroundImage.current;engine.current.edit=true;}}>還原預設關卡</button></div></>}</div>}
  <p className={styles.status} aria-live="polite">{hud.message||`最佳紀錄 ${best} 分`}</p>
 </ArcadeFrame>;
}
