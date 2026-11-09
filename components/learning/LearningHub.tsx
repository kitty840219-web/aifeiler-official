"use client";
import {useState} from "react";
import Link from "next/link";
import GameScenery from "@/components/games/GameScenery";
import {NUMBERED_GAMES} from "@/lib/games/displayCatalog";
import {GAME_CATEGORIES,type GameCategory} from "@/lib/games/catalog";
import GameMascot from "@/components/games/GameMascot";
import {LEARNING_GAMES,LEVELS} from "@/lib/learning/catalog";
import {useLearningProgress} from "@/lib/learning/progress";
import type {Subject} from "@/lib/learning/types";
import LearningShell from "./LearningShell";
import LearningMascot from "./LearningMascot";
import LevelPicker from "./LevelPicker";
import styles from "./Learning.module.css";
export default function LearningHub(){
 const {level}=useLearningProgress(),[subject,setSubject]=useState<Subject|"all">("all");
 const [category,setCategory]=useState<GameCategory>("language");
 const games=NUMBERED_GAMES.filter(g=>(category==="all"||g.group===category)&&(category!=="language"||subject==="all"||(g.learning&&!!LEARNING_GAMES.find(l=>l.id===g.kind)?.subjects.includes(subject))));
 const selected=LEVELS.find(l=>l.id===level)!;
 return <LearningShell title="小艾語言學習館" description="點一點、拼一拼，把每一個小懂得，收進星光裡。"><section className={styles.panel}><p className={styles.eyebrow}>01 · 選一個適合的起點</p><h2>今天，想挑戰哪個學段？</h2><LevelPicker/><p className={styles.focus}>{selected.focus}</p></section><section aria-labelledby="learning-games-heading"><hr className={styles.sectionDivider}/><h2 id="learning-games-heading">更多互動遊戲</h2><div className={styles.subjects} role="group" aria-label="遊戲分類">{GAME_CATEGORIES.map(c=><button key={c.id} type="button" aria-pressed={category===c.id} aria-controls="learning-catalog-results" onClick={()=>{setCategory(c.id);setSubject("all");}}>{c.label}</button>)}</div>
{category==="language"&&<div className={styles.subjects} role="group" aria-label="學習科目">{([["zh","國文"],["en","英文"]] as const).map(([id,label])=><button key={id} type="button" aria-pressed={subject===id} aria-controls="learning-catalog-results" onClick={()=>setSubject(current=>current===id?"all":id)}>{label}</button>)}</div>}
<div id="learning-catalog-results" className={styles.cards}>{games.map(g=>{const learning=g.learning?LEARNING_GAMES.find(l=>l.id===g.kind):undefined;return <Link key={g.id} href={g.href}><GameScenery game={g.scene} className={styles.cardScene}>{g.learning?<LearningMascot kind={g.kind} size={132}/>:<GameMascot game={g.scene} size={132}/>}</GameScenery><div className={styles.cardBody}><span>{g.info}</span><h3><span aria-label={"遊戲編號 "+g.number}>{String(g.number).padStart(2,"0")} · </span>{g.title}</h3>{learning&&<p>{learning.description}</p>}<b>{g.learning?"開始學習 →":"開始玩 →"}</b></div></Link>;})}</div></section><section className={styles.panel}><h2>每次答錯，都有下一個線索。</h2><p>每題都有提示與解析，英文可點擊聽發音。<br/>練習模式可以慢慢想；挑戰模式有三顆愛心。<br/>常錯的內容會收進錯題本，之後再回來練習。</p></section></LearningShell>;
}
