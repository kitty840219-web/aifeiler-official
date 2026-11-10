import type {Quote} from "./samples";
export function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function rank(id:string){let hash=2166136261;for(const char of "aifeiler-calendar-v3:"+id)hash=Math.imul(hash^char.charCodeAt(0),16777619);return hash>>>0;}
const specialDays=new Set(["1-1","2-14","2-29","12-24","12-25","12-31"]);
function dateParts(date:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("日期格式不正確。");
 const [year,month,day]=date.split("-").map(Number),check=new Date(Date.UTC(year,month-1,day));
 if(check.getUTCFullYear()!==year||check.getUTCMonth()+1!==month||check.getUTCDate()!==day)throw new Error("日期不存在。");
 return {year,month,day};
}
export function calendarPool(date:string,quotes:Quote[],manual=false){
 const {year,month,day}=dateParts(date);
 if(!quotes.length)throw new Error("語錄尚未準備完成。");
 const key=month+"-"+day;
 const usable=quotes.filter(q=>!(q.month===2&&q.day===29&&key!=="2-29")&&(!specialDays.has(q.month+"-"+q.day)||q.month+"-"+q.day===key));
 if(!usable.length)throw new Error("尚無適合今天的字卡。");
 const distance=(m:number)=>Math.min(Math.abs(m-month),12-Math.abs(m-month));
 let closest=Math.min(...usable.map(q=>distance(q.month)));
 let allowed=usable.filter(q=>distance(q.month)===closest);
 // While a month is still being illustrated, use the nearest season as fallback.
 if(manual&&allowed.length<2){const alternatives=usable.filter(q=>distance(q.month)>closest);if(alternatives.length){closest=Math.min(...alternatives.map(q=>distance(q.month)));allowed=[...allowed,...alternatives.filter(q=>distance(q.month)===closest)];}}
 const exact=allowed.filter(q=>q.month===month&&q.day===day);
 let preferred=allowed;
 if(!manual&&specialDays.has(key)&&exact.length)preferred=exact;
 else if(!manual&&allowed.every(q=>q.month===month)){
  const nearby=allowed.filter(q=>Math.abs(q.day-day)<=7);
  if(nearby.length)preferred=nearby;
  else{const nearest=Math.min(...allowed.map(q=>Math.abs(q.day-day)));preferred=allowed.filter(q=>Math.abs(q.day-day)===nearest);}
 }
 return {allowed,preferred,year,month,day};
}
export type DailyDraw={date:string;id:string;remaining:string[];scope:string};
export function randomDailyDraw(date:string,quotes:Quote[],saved:unknown,random=Math.random,manual=false):DailyDraw{
 const daily=calendarPool(date,quotes),coverage=calendarPool(date,quotes,true);
 const {allowed,year,month,day}=coverage,preferred=manual?allowed:daily.preferred;
 const seasons=new Set(allowed.map(q=>q.month)),ids=quotes.filter(q=>seasons.has(q.month)).map(q=>q.id),valid=new Set(ids),permitted=new Set(allowed.map(q=>q.id)),prefix=`calendar-v3:${year}-${month}:`;
 const scope=prefix+rank([...ids].sort().join("|"));
 const record=saved&&typeof saved==="object"?saved as Partial<DailyDraw>:null;
 const remaining=Array.isArray(record?.remaining)?[...new Set(record.remaining.filter(id=>typeof id==="string"&&valid.has(id)))]:[];
 const compatible=typeof record?.scope==="string"&&record.scope.startsWith(prefix);
 if(!manual&&compatible&&record?.date===date&&typeof record.id==="string"&&permitted.has(record.id))return {date,id:record.id,remaining:record.scope===scope?remaining:ids.filter(id=>id!==record.id),scope};
 let bag=record?.scope===scope&&remaining.length?remaining:ids;
 let choices=preferred.filter(q=>bag.includes(q.id)&&q.id!==record?.id);
 if(!choices.length)choices=allowed.filter(q=>bag.includes(q.id)&&q.id!==record?.id);
 if(!choices.length){choices=preferred.filter(q=>q.id!==record?.id);if(!choices.length)choices=preferred;bag=[...new Set([...bag,...choices.map(q=>q.id)])];}
 const weights=choices.map(q=>!manual&&q.month===month&&q.day===day?3:1);
 const total=weights.reduce((a,b)=>a+b,0),value=random();let cursor=Math.max(0,Math.min(.999999999,Number.isFinite(value)?value:.5))*total;
 let chosen=choices[choices.length-1];for(let i=0;i<choices.length;i++){cursor-=weights[i];if(cursor<0){chosen=choices[i];break;}}
 return {date,id:chosen.id,remaining:bag.filter(id=>id!==chosen.id),scope};
}
export function dailyQuote(date:string,quotes:Quote[],previousId?:string):Quote{
 const draw=randomDailyDraw(date,quotes,previousId?{id:previousId}:null,()=>rank(date)/4294967296);
 return quotes.find(q=>q.id===draw.id)!;
}
