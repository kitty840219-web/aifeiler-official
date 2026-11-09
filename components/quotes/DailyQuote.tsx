"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {QUOTES,type Quote} from "@/lib/quotes/samples";
import {renderCard,dateLabel,type CardFormat} from "@/lib/quotes/render";
import {asset} from "@/lib/basePath";
import styles from "./DailyQuote.module.css";
type Category="all"|"work"|"love";
function today(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function nearest(date:string,pool:Quote[]){const [,month,day]=date.split("-").map(Number);return [...pool].sort((a,b)=>Math.abs(a.month-month)*31+Math.abs(a.day-day)-(Math.abs(b.month-month)*31+Math.abs(b.day-day)))[0];}
function sampleDate(q:Quote,year:string){return year+"-"+String(q.month).padStart(2,"0")+"-"+String(q.day).padStart(2,"0");}
export default function DailyQuote(){
 const [id,setId]=useState("w1"),[category,setCategory]=useState<Category>("all"),[date,setDate]=useState("2026-11-09"),[favorites,setFavorites]=useState<string[]>([]),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[speaking,setSpeaking]=useState(false),[renderedKey,setRenderedKey]=useState("");
 const imageReady=renderedKey===id+"|"+date;
 const canvas=useRef<HTMLCanvasElement>(null),liveDay=useRef("");
 const gallery=useRef<HTMLDivElement>(null);
 function browse(direction:number){const track=gallery.current;if(track)track.scrollBy({left:direction*(track.querySelector("button")?.getBoundingClientRect().width||track.clientWidth)*1.04,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
 const q=QUOTES.find(item=>item.id===id)!;const pool=QUOTES.filter(item=>category==="all"||item.category===category);
 useEffect(()=>{const frame=requestAnimationFrame(()=>{const d=today();liveDay.current=d;setDate(d);setId(nearest(d,QUOTES).id);try{const saved=JSON.parse(localStorage.getItem("aifeiler-quote-favorites")||"[]");if(Array.isArray(saved))setFavorites(saved.filter((v:unknown)=>typeof v==="string"&&QUOTES.some(q=>q.id===v)));}catch{}setReady(true);});const timer=setInterval(()=>{const next=today();if(next!==liveDay.current){liveDay.current=next;setDate(next);setId(nearest(next,QUOTES).id);setCategory("all");}},30000);return()=>{cancelAnimationFrame(frame);clearInterval(timer);window.speechSynthesis?.cancel();};},[]);
 useEffect(()=>{let cancelled=false;const target=document.createElement("canvas");const font=canvas.current?getComputedStyle(canvas.current).fontFamily:"serif";renderCard(target,q,date,"card",font).then(()=>{if(!cancelled&&canvas.current){canvas.current.width=target.width;canvas.current.height=target.height;canvas.current.getContext("2d")?.drawImage(target,0,0);setRenderedKey(id+"|"+date);}}).catch(error=>{if(!cancelled)setMessage(error.message);});return()=>{cancelled=true;};},[q,date,id]);
 function choose(next:Quote){window.speechSynthesis?.cancel();setSpeaking(false);setId(next.id);setDate(sampleDate(next,date.slice(0,4)));setMessage("");}
 function daily(){const d=today();setDate(d);setId(nearest(d,pool).id);setMessage("已回到今天。試作版目前有10張月份字卡。");}
 function draw(){const others=pool.filter(item=>item.id!==id);choose(others[Math.floor(Math.random()*others.length)]||pool[0]);setMessage("為你抽到另一個月份的小提醒。");}
 function save(){const next=favorites.includes(id)?favorites.filter(v=>v!==id):[...favorites,id];setFavorites(next);try{localStorage.setItem("aifeiler-quote-favorites",JSON.stringify(next));setMessage(next.includes(id)?"已收藏，留給需要的那一天。":"已取消收藏。");}catch{setMessage("本次已收藏；瀏覽器無法儲存，關閉後可能消失。");}}
 function speak(){if(!("speechSynthesis" in window)){setMessage("此瀏覽器不支援朗讀，請使用手機或電腦的系統朗讀功能。");return;}window.speechSynthesis.cancel();if(speaking){setSpeaking(false);return;}const utterance=new SpeechSynthesisUtterance(q.en);utterance.lang="en-US";utterance.rate=.82;utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setMessage("英文語音暫時無法播放，請檢查裝置語音設定。");};setSpeaking(true);window.speechSynthesis.speak(utterance);}
 async function download(format:CardFormat){setBusy(true);setMessage("");try{const output=document.createElement("canvas");await renderCard(output,q,date,format,canvas.current?getComputedStyle(canvas.current).fontFamily:"serif");const blob=await new Promise<Blob>((resolve,reject)=>output.toBlob(b=>b?resolve(b):reject(new Error("圖片製作失敗，請再試一次。")),"image/png"));const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="Aifeiler-"+date+"-"+q.id+"-"+format+".png";link.click();setTimeout(()=>URL.revokeObjectURL(url),120000);setMessage("圖片已準備下載；手機若開啟圖片預覽，可長按儲存至照片。");}catch(error){setMessage(error instanceof Error?error.message:"下載失敗，請稍後重試。");}finally{setBusy(false);}}
 return <main className={styles.world} data-game-page="">
  <Link className={styles.back} href="/learn/">← 星光遊樂園</Link>
  <header><p className={styles.eyebrow}>A LITTLE LIGHT, EVERY DAY</p><h1>每日一句，留給自己。</h1><p>把一句溫柔，放進今天的生活裡。</p><span className={styles.badge}>10 張字卡試作 · 職場 5 張／感情 5 張</span></header>
  <div className={styles.filters} role="group" aria-label="語錄主題">{([["all","全部心情"],["work","職場與成長"],["love","感情與療癒"]] as const).map(([key,label])=><button key={key} type="button" aria-pressed={category===key} onClick={()=>{setCategory(key);const nextPool=QUOTES.filter(item=>key==="all"||item.category===key);const next=nearest(date,nextPool);choose(next);}}>{label}</button>)}</div>
  <section className={styles.feature} aria-label="雙語語錄字卡">
   <div className={styles.cardFrame}><canvas ref={canvas} width={1200} height={800} role="img" aria-label={dateLabel(date)+"。"+q.zh+" "+q.en}/>{!imageReady&&<span className={styles.loading}>正在準備你的字卡…</span>}</div>
   <div className={styles.caption}><span>{String(q.number).padStart(2,"0")}／10 · {q.month}月 · {q.theme}</span><button type="button" onClick={speak} aria-pressed={speaking}>{speaking?"■ 停止朗讀":"♪ 聽英文"}</button></div>
   <p className={styles.readable}>{q.zh}<span lang="en">{q.en}</span></p>
   <div className={styles.actions}><button type="button" className={styles.primary} disabled={!ready} onClick={draw}>✦ 再抽一張</button><button type="button" disabled={!ready} onClick={daily}>今日一句</button><button type="button" disabled={!ready} aria-pressed={favorites.includes(id)} onClick={save}>{favorites.includes(id)?"♥ 已收藏":"♡ 收藏字卡"}</button></div>
   <div className={styles.downloads}><button type="button" disabled={busy||!imageReady} onClick={()=>download("card")}>下載橫式字卡</button><button type="button" disabled={busy||!imageReady} onClick={()=>download("phone")}>下載手機桌布</button><button type="button" disabled={busy||!imageReady} onClick={()=>download("desktop")}>下載電腦桌布</button></div>
   <p className={styles.status} role="status" aria-live="polite">{busy?"正在製作圖片…":message}</p>
  </section>
  <section className={styles.gallerySection} aria-label="背景字卡瀏覽"><p>左右滑動瀏覽，點一張預覽與下載。</p><div className={styles.galleryViewport}><div className={styles.galleryNav}><button type="button" aria-label="上一張背景" onClick={()=>browse(-1)}>‹</button><button type="button" aria-label="下一張背景" onClick={()=>browse(1)}>›</button></div><div ref={gallery} className={styles.gallery} tabIndex={0} role="region" aria-label="可左右滑動的背景字卡" onKeyDown={e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();browse(e.key==="ArrowLeft"?-1:1);}}}>{pool.map(item=><button type="button" key={item.id} aria-pressed={item.id===id} onClick={()=>choose(item)}><span className={styles.thumb} style={{backgroundImage:"url("+asset(item.art<0?"/images/quotes/november-garden.png":"/images/quotes/monthly-atlas.png")+")",backgroundSize:item.art<0?"100% 100%":["300% 300.293%","300% 313.15%","300% 287.64%"][Math.floor(item.art/3)],backgroundPosition:item.art<0?"center":(item.art%3)*50+"% "+[0,48.924,100][Math.floor(item.art/3)]+"%"}}/><span className={styles.galleryCopy}><small>{String(item.number).padStart(2,"0")} · {item.month}月{item.day}日 · {item.category==="work"?"職場":"感情"}</small><b>{item.zh}</b></span></button>)}</div></div></section>
  {favorites.length>0&&<section className={styles.saved}><h2>我的溫柔收藏</h2><p>保存在這台裝置的瀏覽器，清除資料後會移除。</p>{QUOTES.filter(item=>favorites.includes(item.id)).map(item=><button type="button" key={item.id} onClick={()=>{setCategory("all");choose(item);canvas.current?.scrollIntoView({behavior:"smooth",block:"center"});}}>{String(item.number).padStart(2,"0")} · {item.zh}</button>)}</section>}

 </main>;
}
