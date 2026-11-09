import type {Quote} from "./samples";
export function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function rank(id:string){let hash=2166136261;for(const char of "aifeiler-calendar-v2:"+id)hash=Math.imul(hash^char.charCodeAt(0),16777619);return hash>>>0;}
export function dailyQuote(date:string,quotes:Quote[],previousId?:string):Quote{
 if(!quotes.length)throw new Error("語錄尚未準備完成。");
 const [year,month,day]=date.split("-").map(Number);
 const calendarDay=Math.floor(Date.UTC(year,month-1,day)/86400000);
 const order=[...quotes].sort((a,b)=>rank(a.id)-rank(b.id)||a.id.localeCompare(b.id));
 const index=((calendarDay%order.length)+order.length)%order.length;
 const chosen=order[index];
 return chosen.id===previousId&&order.length>1?order[(index+1)%order.length]:chosen;
}
