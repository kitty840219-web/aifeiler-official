"use client";

import { useState } from "react";
import ArcadeFrame, { useRecord } from "./ArcadeFrame";
import styles from "./Arcade.module.css";

type Card = { suit: number; rank: number; up: boolean };
type Table = { stock: Card[]; waste: Card[]; foundations: Card[][]; columns: Card[][]; moves: number };
type Source = { kind: "waste" } | { kind: "foundation"; col: number } | { kind: "table"; col: number; index: number };
const suits = ["♠", "♥", "♣", "♦"];
const red = (c: Card) => c.suit === 1 || c.suit === 3;
const label = (c: Card) => `${["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][c.rank]}${suits[c.suit]}`;
function deal(): Table {
 const cards: Card[]=[];for(let suit=0;suit<4;suit++)for(let rank=1;rank<=13;rank++)cards.push({suit,rank,up:false});
 for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
 const columns:Card[][]=[];for(let c=0;c<7;c++){const pile=cards.splice(0,c+1);pile[pile.length-1].up=true;columns.push(pile);}return{stock:cards,waste:[],foundations:[[],[],[],[]],columns,moves:0};
}
export default function SolitaireGame(){
 const[table,setTable]=useState<Table|null>(null),[selected,setSelected]=useState<Source|null>(null),[history,setHistory]=useState<Table[]>([]),[message,setMessage]=useState("");const{best,save}=useRecord("solitaire");
 const completed=table?.foundations.reduce((n,p)=>n+p.length,0)||0;
 function start(){setTable(deal());setSelected(null);setHistory([]);setMessage("選一張明牌，再點要放置的列或花色牌堆。");}
 function commit(next:Table){if(!table)return;setHistory(h=>[...h.slice(-99),table]);next.moves=table.moves+1;setTable(next);setSelected(null);if(next.foundations.flat().length===52){setMessage("四種花色都整理好了，你完成接龍了！");save(520);}}
 function remove(next:Table,source:Source){if(source.kind==="waste")next.waste.pop();else if(source.kind==="foundation")next.foundations[source.col].pop();else{next.columns[source.col].splice(source.index);const last=next.columns[source.col].at(-1);if(last)last.up=true;}}
 function moving():Card[]{if(!table||!selected)return[];return selected.kind==="waste"?table.waste.slice(-1):selected.kind==="foundation"?table.foundations[selected.col].slice(-1):table.columns[selected.col].slice(selected.index);}
 function toColumn(col:number){if(!table||!selected)return;const cards=moving();if(!cards.length)return;if(selected.kind==="table"&&selected.col===col){setSelected(null);return;}const top=table.columns[col].at(-1),first=cards[0];if(top?top.rank!==first.rank+1||red(top)===red(first):first.rank!==13){setMessage("不同顏色、依序遞減才能放；空列只接受 K。");return;}const next:Table=structuredClone(table);remove(next,selected);next.columns[col].push(...cards);commit(next);setMessage("很好，繼續整理下一張。");}
 function toFoundation(suit:number){if(!table||!selected)return;const cards=moving();if(cards.length!==1||cards[0].suit!==suit||cards[0].rank!==table.foundations[suit].length+1){setMessage("花色牌堆要從 A 開始，同花色依序增加，而且一次放一張。");return;}const next:Table=structuredClone(table);remove(next,selected);next.foundations[suit].push(cards[0]);commit(next);}
 function draw(){if(!table||completed===52)return;const next:Table=structuredClone(table);if(next.stock.length){const c=next.stock.pop()!;c.up=true;next.waste.push(c);}else if(next.waste.length){next.stock=next.waste.reverse().map(c=>({...c,up:false}));next.waste=[];}else return;commit(next);}
 function choose(source:Source){if(completed===52)return;setSelected(source);setMessage("已選牌。點花色牌堆，或點某一列下方的「放這裡」。");}
 function card(c:Card,key:string,onClick:()=>void,active=false){return <button key={key} disabled={!c.up||completed===52} onClick={onClick} className={`${styles.playingCard} ${red(c)?styles.redCard:""} ${!c.up?styles.cardBack:""} ${active?styles.selectedCard:""}`} aria-label={c.up?label(c):"蓋牌"}>{c.up?<><b>{label(c)}</b><span>{suits[c.suit]}</span></>:"✦"}</button>;}
 return <ArcadeFrame title="小艾紙牌接龍" description="一張張整理思緒，把四種花色送回家。" rules={["經典 Klondike 單張翻牌：先點牌選取，再點「放這裡」或上方花色牌堆。", "下方七列依紅黑交替、數字遞減堆疊；可以搬移一整段明牌，空列只放 K。", "上方四堆由 A 到 K、同花色遞增，每次只能放一張。翻牌堆用完可重新循環。", "支援復原最近 100 步。收齊 52 張獲得 520 分，無法繼續時可重新發牌。"]}>
 {table?<><div className={styles.scores}><span>步數 <b>{table.moves}</b></span><span>歸位 <b>{completed}/52</b></span></div><div className={styles.cardTable}><div className={styles.foundations}><button className={styles.stock} onClick={draw} aria-label={table.stock.length?"翻一張牌":"重新循環翻牌堆"}>{table.stock.length?"✦":"↻"}<small>{table.stock.length}</small></button><div>{table.waste.length?card(table.waste.at(-1)!,"waste",()=>choose({kind:"waste"}),selected?.kind==="waste"):<span className={styles.cardSlot}>·</span>}</div>{suits.map((s,i)=><button key={s} onClick={()=>toFoundation(i)} className={`${styles.cardSlot} ${i===1||i===3?styles.redCard:""}`} aria-label={`送到${s}牌堆`}>{table.foundations[i].length?label(table.foundations[i].at(-1)!):s}</button>)}</div><div className={styles.tableau}>{table.columns.map((pile,col)=><div key={col} className={styles.pile}>{pile.map((c,index)=><div key={`${c.suit}-${c.rank}`} style={{marginTop:index?-34:0}}>{card(c,`${col}-${index}`,()=>choose({kind:"table",col,index}),selected?.kind==="table"&&selected.col===col&&selected.index===index)}</div>)}<button className={styles.pileTarget} onClick={()=>toColumn(col)} aria-label={`放到第${col+1}列`}>放這裡</button></div>)}</div></div><p className={styles.status} aria-live="polite">{message}</p><div className={styles.row}><button disabled={!history.length} onClick={()=>{if(!history.length)return;setTable(history.at(-1)!);setHistory(h=>h.slice(0,-1));setSelected(null);setMessage("已復原。");}}>復原</button><button onClick={start}>重新發牌</button></div></>:<div className={styles.result}><span className={styles.heroIcon}>♠ ♥</span><h2>讓思緒，慢慢歸位。</h2><button className={styles.primary} onClick={start}>開始接龍</button></div>}<p className={styles.note}>最佳 {best} 分</p>
 </ArcadeFrame>;
}
