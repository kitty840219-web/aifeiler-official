import type {Quote} from "./samples";
export function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
export function dailyQuote(date:string,quotes:Quote[]):Quote{
 let hash=2166136261;for(const char of "aifeiler-daily-v1:"+date){hash=Math.imul(hash^char.charCodeAt(0),16777619);}
 hash^=hash>>>16;hash=Math.imul(hash,0x7feb352d);hash^=hash>>>15;hash=Math.imul(hash,0x846ca68b);hash^=hash>>>16;
 const category=(hash>>>0)%2===0?"work":"love";
 const [,month,day]=date.split("-").map(Number);
 const pool=quotes.filter(q=>q.category===category);
 return [...(pool.length?pool:quotes)].sort((a,b)=>(Math.abs(a.month-month)*31+Math.abs(a.day-day))-(Math.abs(b.month-month)*31+Math.abs(b.day-day)))[0];
}
