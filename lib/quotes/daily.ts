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

export type DailyDraw={date:string;id:string;remaining:string[];scope:string};
export function randomDailyDraw(date:string,quotes:Quote[],saved:unknown,random= Math.random):DailyDraw{
 const month=Number(date.slice(5,7));
 const monthly=quotes.filter(q=>q.month===month);
 const pool=quotes.length>=365&&monthly.length?monthly:quotes;
 if(!pool.length)throw new Error("語錄尚未準備完成。");
 const scope=pool===quotes?"preview-"+quotes.length:"month-"+month;
 const ids=pool.map(q=>q.id),valid=new Set(ids);
 const record=saved&&typeof saved==="object"?saved as Partial<DailyDraw>:null;
 const remaining=Array.isArray(record?.remaining)?[...new Set(record.remaining.filter(id=>typeof id==="string"&&valid.has(id)))]:[];
 if(record?.date===date&&typeof record.id==="string"&&quotes.some(q=>q.id===record.id))return {date,id:record.id,remaining:record.remaining?remaining:ids.filter(id=>id!==record.id),scope};
 const bag=record?.scope===scope&&remaining.length?remaining:ids;
 const eligible=bag.length>1?bag.filter(id=>id!==record?.id):bag;
 const choices=eligible.length?eligible:bag;
 const index=Math.max(0,Math.min(choices.length-1,Math.floor(random()*choices.length)));
 const id=choices[index];
 return {date,id,remaining:bag.filter(item=>item!==id),scope};
}
