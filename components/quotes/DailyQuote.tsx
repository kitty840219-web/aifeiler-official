"use client";
import {useEffect,useRef,useState} from "react";
import {QUOTES} from "@/lib/quotes/samples";
import {dailyQuote,randomDailyDraw,localDate} from "@/lib/quotes/daily";
import {renderCard,dateLabel,type CardFormat} from "@/lib/quotes/render";
import styles from "./DailyQuote.module.css";
import QuoteFavorites from "./QuoteFavorites";
export default function DailyQuote(){
 const [id,setId]=useState(QUOTES[0].id),[date,setDate]=useState(""),[favorites,setFavorites]=useState<string[]>([]),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[speaking,setSpeaking]=useState(false),[renderedKey,setRenderedKey]=useState("");
 const [favoriteDates,setFavoriteDates]=useState<Record<string,string>>({});
 const canvas=useRef<HTMLCanvasElement>(null),liveDay=useRef("");
 const q=QUOTES.find(item=>item.id===id)||QUOTES[0],imageReady=!!date&&renderedKey===id+"|"+date;
 useEffect(()=>{
  function refresh(){const d=localDate();if(d===liveDay.current)return;liveDay.current=d;let chosen=dailyQuote(d,QUOTES);try{const saved=JSON.parse(localStorage.getItem("aifeiler-daily-quote-v1")||"null");const draw=randomDailyDraw(d,QUOTES,saved);chosen=QUOTES.find(q=>q.id===draw.id)!;localStorage.setItem("aifeiler-daily-quote-v1",JSON.stringify(draw));}catch{}setDate(d);setId(chosen.id);setSpeaking(false);window.speechSynthesis?.cancel();}
  const frame=requestAnimationFrame(()=>{refresh();try{const saved=JSON.parse(localStorage.getItem("aifeiler-quote-favorites")||"[]");if(Array.isArray(saved))setFavorites(saved.filter((v:unknown)=>typeof v==="string"));}catch{}try{const savedDates=JSON.parse(localStorage.getItem("aifeiler-quote-favorite-dates")||"{}");if(savedDates&&typeof savedDates==="object"&&!Array.isArray(savedDates))setFavoriteDates(Object.fromEntries(Object.entries(savedDates).filter((entry):entry is [string,string]=>typeof entry[1]==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(entry[1]))));}catch{}setReady(true);});
  const timer=setInterval(refresh,30000);window.addEventListener("focus",refresh);document.addEventListener("visibilitychange",refresh);
  return()=>{cancelAnimationFrame(frame);clearInterval(timer);window.removeEventListener("focus",refresh);document.removeEventListener("visibilitychange",refresh);window.speechSynthesis?.cancel();};
 },[]);
 useEffect(()=>{if(!date)return;let cancelled=false;const target=document.createElement("canvas");const font=canvas.current?getComputedStyle(canvas.current).fontFamily:"serif";renderCard(target,q,date,"card",font).then(()=>{if(!cancelled&&canvas.current){canvas.current.width=target.width;canvas.current.height=target.height;canvas.current.getContext("2d")?.drawImage(target,0,0);setRenderedKey(id+"|"+date);}}).catch(error=>{if(!cancelled)setMessage(error.message);});return()=>{cancelled=true;};},[q,date,id]);
 function drawManual(){
  const d=localDate();let next=QUOTES.filter(item=>item.id!==id)[0]||q;
  try{const stored=JSON.parse(localStorage.getItem("aifeiler-daily-quote-v1")||"null");const draw=randomDailyDraw(d,QUOTES,{...(stored&&typeof stored==="object"?stored:{}),date:"",id});next=QUOTES.find(item=>item.id===draw.id)!;localStorage.setItem("aifeiler-daily-quote-v1",JSON.stringify(draw));}catch{const choices=QUOTES.filter(item=>item.id!==id);next=choices[Math.floor(Math.random()*choices.length)]||q;}
  window.speechSynthesis?.cancel();setSpeaking(false);liveDay.current=d;setDate(d);setId(next.id);setMessage("已抽到另一張字卡。");
 }
 function persistFavorites(next:string[],dates:Record<string,string>){setFavorites(next);setFavoriteDates(dates);try{localStorage.setItem("aifeiler-quote-favorites",JSON.stringify(next));localStorage.setItem("aifeiler-quote-favorite-dates",JSON.stringify(dates));}catch{setMessage("本次已更新收藏；瀏覽器無法儲存，關閉後可能消失。");}}
 function removeFavorite(savedId:string){const dates={...favoriteDates};delete dates[savedId];persistFavorites(favorites.filter(v=>v!==savedId),dates);setMessage("已取消收藏。");}
 function save(){if(favorites.includes(id)){removeFavorite(id);return;}persistFavorites([...favorites,id],{...favoriteDates,[id]:date});setMessage("已收藏，可從下方「我的收藏」查看。");}
 function speak(){if(!("speechSynthesis" in window)){setMessage("此瀏覽器不支援朗讀，請使用裝置的系統朗讀功能。");return;}window.speechSynthesis.cancel();if(speaking){setSpeaking(false);return;}const utterance=new SpeechSynthesisUtterance(q.en);utterance.lang="en-US";utterance.rate=.82;utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setMessage("英文語音暫時無法播放，請檢查裝置語音設定。");};setSpeaking(true);window.speechSynthesis.speak(utterance);}
 async function download(format:CardFormat){if(!date)return;setBusy(true);setMessage("");try{const output=document.createElement("canvas");await renderCard(output,q,date,format,canvas.current?getComputedStyle(canvas.current).fontFamily:"serif");const blob=await new Promise<Blob>((resolve,reject)=>output.toBlob(b=>b?resolve(b):reject(new Error("圖片製作失敗，請再試一次。")),"image/png"));const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="Aifeiler-"+date+"-"+q.id+"-"+format+".png";link.click();setTimeout(()=>URL.revokeObjectURL(url),120000);setMessage("圖片已準備下載；手機若開啟圖片預覽，可長按儲存至照片。");}catch(error){setMessage(error instanceof Error?error.message:"下載失敗，請稍後重試。");}finally{setBusy(false);}}
 return <main className={styles.world} data-game-page="">
  <header><p className={styles.eyebrow}>A LITTLE LIGHT, EVERY DAY</p><h1>每日一句，留給自己。</h1><p>把一句溫柔，放進今天的生活裡。</p></header>
  <section className={styles.feature} aria-label="今日雙語語錄字卡">
   <div className={styles.cardFrame}><canvas ref={canvas} width={1200} height={800} role="img" aria-label={date?dateLabel(date)+"。"+(q.category==="work"?"工作篇":"愛情篇")+"。"+q.zh+" "+q.en:"正在準備今日字卡"}/>{!imageReady&&<span className={styles.loading}>正在準備今天的字卡…</span>}</div>
   <div className={styles.caption}><span>{q.category==="work"?"工作篇 · 職場與成長":"愛情篇 · 感情與療癒"}</span><button type="button" onClick={speak} disabled={!ready} aria-pressed={speaking}>{speaking?"■ 停止朗讀":"♪ 聽英文"}</button></div>
   <p className={styles.readable}>{q.zh}<span lang="en">{q.en}</span></p>
   <div className={styles.actions}><button type="button" className={styles.primary} disabled={!ready||busy} onClick={drawManual}>✦ 隨機抽卡</button><button type="button" disabled={!ready} aria-pressed={favorites.includes(id)} onClick={save}>{favorites.includes(id)?"♥ 已收藏":"♡ 收藏今天的字卡"}</button></div>
   <div className={styles.downloads}><button type="button" disabled={busy||!imageReady} onClick={()=>download("card")}>下載橫式字卡</button><button type="button" disabled={busy||!imageReady} onClick={()=>download("phone")}>下載手機桌布</button><button type="button" disabled={busy||!imageReady} onClick={()=>download("desktop")}>下載電腦桌布</button></div>
   <p className={styles.status} role="status" aria-live="polite">{busy?"正在製作圖片…":message}</p>
  </section>
  <QuoteFavorites ids={favorites} dates={favoriteDates} today={date} onRemove={removeFavorite}/>
 </main>;
}
