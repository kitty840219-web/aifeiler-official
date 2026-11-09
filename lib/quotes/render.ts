import {asset} from "@/lib/basePath";
import type {Quote} from "./samples";
export type CardFormat="card"|"phone"|"desktop";
const images=new Map<string,Promise<HTMLImageElement>>();
function image(src:string):Promise<HTMLImageElement>{
 const cached=images.get(src);if(cached)return cached;
 const pending=new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.decoding="async";img.onload=()=>resolve(img);img.onerror=()=>{images.delete(src);reject(new Error("背景圖片暫時無法載入，請稍後重試。"));};img.src=asset(src);});
 images.set(src,pending);return pending;
}
function lines(ctx:CanvasRenderingContext2D,text:string,width:number,english=false){
 const words=english?text.split(" "):Array.from(text);const result:string[]=[];let line="";
 for(const word of words){const next=line+(english&&line?" ":"")+word;if(ctx.measureText(next).width>width&&line&&!(!english&&/[，。！？、；：）」』】]/.test(word))){result.push(line);line=word;}else line=next;}
 if(line)result.push(line);return result;
}
export function dateLabel(date:string){return new Intl.DateTimeFormat("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(new Date(date+"T12:00:00"));}
export async function renderCard(canvas:HTMLCanvasElement,q:Quote,date:string,format:CardFormat,font:string){
 const [img]=await Promise.all([image(q.art<0?"/images/quotes/november-garden.webp":"/images/quotes/monthly-atlas.webp"),document.fonts.ready]);
 const phone=format==="phone",desktop=format==="desktop";canvas.width=phone?1080:desktop?1920:1200;canvas.height=phone?1920:desktop?1080:800;
 const ctx=canvas.getContext("2d");if(!ctx)throw new Error("目前瀏覽器無法製作圖片。");
 ctx.fillStyle="#fbf0dc";ctx.fillRect(0,0,canvas.width,canvas.height);
 const row=Math.floor(q.art/3),cuts=[0,341/1024,668/1024,1];
 const sx=q.art<0?0:(q.art%3)*img.width/3,sy=q.art<0?0:cuts[row]*img.height,sw=q.art<0?img.width:img.width/3,sh=q.art<0?img.height:(cuts[row+1]-cuts[row])*img.height;
 if(phone){ctx.drawImage(img,sx,sy,sw,sh,0,1060,1080,720);const grad=ctx.createLinearGradient(0,1050,0,1220);grad.addColorStop(0,"#fbf0dc");grad.addColorStop(1,"#fbf0dc00");ctx.fillStyle=grad;ctx.fillRect(0,1050,1080,180);}
 else ctx.drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
 const scale=desktop?1.35:1;
 if(!phone){ctx.fillStyle="#fff8e852";ctx.beginPath();ctx.roundRect(canvas.width/2-490*scale,205*scale,980*scale,385*scale,26*scale);ctx.fill();}const center=canvas.width/2;const width=phone?850:desktop?1250:900;
 ctx.textAlign="center";ctx.textBaseline="middle";
 ctx.fillStyle="#57425f";ctx.font=`600 ${phone?42:42*scale}px ${font}`;ctx.fillText("每日一句·艾飛樂語錄",center,phone?420:92*scale);
 ctx.fillStyle="#4b3656";ctx.font=`600 ${phone?46:46*scale}px ${font}`;ctx.shadowColor="#fffaf0";ctx.shadowBlur=5;ctx.fillText(dateLabel(date),center,phone?510:165*scale);ctx.shadowBlur=0;
 const zhSize=phone?62:60*scale,enSize=phone?43:40*scale,zhGap=phone?90:82*scale,enGap=phone?64:56*scale,between=phone?44:36*scale;
 ctx.font=`600 ${zhSize}px ${font}`;
 const comma=q.zh.indexOf("，");
 const phrases=comma>=0?[q.zh.slice(0,comma+1),q.zh.slice(comma+1)]:[q.zh];
 const zh=phrases.flatMap(phrase=>lines(ctx,phrase,width));
 ctx.font=`400 ${enSize}px Georgia,serif`;const en=lines(ctx,q.en,width,true);
 const zhHeight=zhSize+(zh.length-1)*zhGap,enHeight=enSize+(en.length-1)*enGap;
 const groupHeight=zhHeight+between+enHeight,midpoint=phone?820:397.5*scale;
 const top=midpoint-groupHeight/2;
 ctx.shadowColor="#fffaf0";ctx.shadowBlur=phone?6:5*scale;
 ctx.fillStyle="#342943";ctx.font=`600 ${zhSize}px ${font}`;
 zh.forEach((line,i)=>ctx.fillText(line,center,top+zhSize/2+i*zhGap));
 ctx.fillStyle="#51415e";ctx.font=`400 ${enSize}px Georgia,serif`;
 en.forEach((line,i)=>ctx.fillText(line,center,top+zhHeight+between+enSize/2+i*enGap));
 ctx.shadowBlur=0;
 ctx.fillStyle="#806b4e";ctx.font=`400 ${phone?28:23*scale}px ${font}`;ctx.fillText("艾飛樂 · "+(q.category==="work"?"職場與成長":"感情與療癒"),center,phone?1840:730*scale);
}
