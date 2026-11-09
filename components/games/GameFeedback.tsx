"use client";
import Link from "next/link";
import {useEffect,useRef,useState,useSyncExternalStore} from "react";
import {FEEDBACK_EVENT,REPLAY_EVENT,gameNotice,playGameSound,setSoundEnabled,soundEnabled,subscribeSound,unlockGameAudio,type GameNotice} from "@/lib/games/feedback";
import GameMascot from "./GameMascot";
import GameScenery from "./GameScenery";
import styles from "./GameFeedback.module.css";
export default function GameFeedback({game}:{game:string}){
 const sound=useSyncExternalStore(subscribeSound,soundEnabled,()=>true);
 const[toast,setToast]=useState<(GameNotice&{id:number})|null>(null),[result,setResult]=useState<GameNotice|null>(null);
 const serial=useRef(0),dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{let timer:ReturnType<typeof setTimeout>|undefined;const feedback=(event:Event)=>{const notice=(event as CustomEvent<GameNotice>).detail;if(notice.game!==game)return;playGameSound(notice.kind,notice.outcome);clearTimeout(timer);if(notice.kind==="finish"){setToast(null);setResult(notice);}else{setToast({...notice,id:++serial.current});timer=setTimeout(()=>setToast(null),notice.kind==="error"?1400:1000);}};window.addEventListener(FEEDBACK_EVENT,feedback);document.addEventListener("pointerdown",unlockGameAudio,true);document.addEventListener("keydown",unlockGameAudio,true);return()=>{clearTimeout(timer);window.removeEventListener(FEEDBACK_EVENT,feedback);document.removeEventListener("pointerdown",unlockGameAudio,true);document.removeEventListener("keydown",unlockGameAudio,true);};},[game]);
 useEffect(()=>{if(result&&dialog.current&&!dialog.current.open){dialog.current.showModal();dialog.current.scrollTop=0;dialog.current.focus({preventScroll:true});}},[result]);
 const score=result?.score||0;let savedBest=0;try{savedBest=Number(typeof window!=="undefined"?localStorage.getItem(`aifeiler-best-${game}`):0)||0;}catch{}
 const stats=result?.stats||[{label:"本局分數",value:String(score)},{label:"最佳紀錄",value:String(Math.max(result?.best||0,savedBest,score))},{label:"獲得星光",value:`＋${result?.reward??Math.min(15,Math.floor(score/5))}`}];
 function close(){dialog.current?.close();setResult(null);}
 function replay(){close();window.dispatchEvent(new CustomEvent(REPLAY_EVENT,{detail:game}));}
 return <>
  <div className={styles.soundRow}><button type="button" aria-pressed={sound} className={styles.soundButton} onClick={()=>{setSoundEnabled(!sound);if(!sound)gameNotice(game,"info","音效已開啟");}}>{sound?"♪ 音效開啟":"♪ 音效關閉"}</button><span>正確、失誤與成績都有提示</span></div>
  {toast&&<div key={toast.id} className={`${styles.toast} ${styles[toast.kind]}`} role="status" aria-live={toast.kind==="error"?"assertive":"polite"}><b aria-hidden="true">{toast.kind==="error"?"×":toast.kind==="miss"?"！":toast.kind==="info"?"•":"✓"}</b><div><strong>{toast.message}</strong>{toast.points!==undefined&&<span>{toast.points>0?"+":""}{toast.points} 分</span>}</div></div>}
  <dialog ref={dialog} tabIndex={-1} className={styles.dialog} aria-label="本局遊戲成績" onClose={()=>setResult(null)}>
   {result&&<><GameScenery game={result.outcome==="over"?game:"victory"} className={styles.resultArt}><GameMascot game={game} size={132} /></GameScenery><div className={styles.resultBody}><p className={styles.label}>{result.outcome==="over"?"本局結束":result.outcome==="draw"?"本局平手":"挑戰完成"}</p><h2>{result.message}</h2><div className={styles.stats}>{stats.map(s=><div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div><div className={styles.actions}>{result.canRestart!==false&&<button type="button" onClick={replay}>再玩一次</button>}<button type="button" className={styles.secondary} onClick={close}>{result.canRestart===false?"回到遊戲":"查看遊戲畫面"}</button><Link href="/games">選其他遊戲 →</Link></div></div></>}
  </dialog>
 </>;
}
