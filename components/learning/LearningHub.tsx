"use client";
import {useState} from "react";
import Link from "next/link";
import GameScenery from "@/components/games/GameScenery";
import {gameNumber} from "@/lib/games/displayCatalog";
import {LEARNING_GAMES,LEVELS} from "@/lib/learning/catalog";
import {useLearningProgress} from "@/lib/learning/progress";
import type {Subject} from "@/lib/learning/types";
import LearningShell from "./LearningShell";
import LearningMascot from "./LearningMascot";
import LevelPicker from "./LevelPicker";
import styles from "./Learning.module.css";
export default function LearningHub(){
 const {level}=useLearningProgress(),[subject,setSubject]=useState<Subject|"all">("all");
 const games=LEARNING_GAMES.filter(g=>subject==="all"||g.subjects.includes(subject));
 const selected=LEVELS.find(l=>l.id===level)!;
 return <LearningShell title="小艾語言學習館" description="點一點、拼一拼，把每一個小懂得，收進星光裡。"><section className={styles.panel}><p className={styles.eyebrow}>01 · 選一個適合的起點</p><h2>今天，想挑戰哪個學段？</h2><LevelPicker/><p className={styles.focus}>{selected.focus}</p></section><section aria-labelledby="learning-games-heading"><p className={styles.eyebrow}>02 · 選一個語言小世界</p><h2 id="learning-games-heading">用喜歡的方式學習</h2><div className={styles.subjects} role="group" aria-label="學習科目">{[["all","全部遊戲"],["zh","國文"],["en","英文"]].map(([id,label])=><button key={id} type="button" aria-pressed={subject===id} onClick={()=>setSubject(id as Subject|"all")}>{label}</button>)}</div><div className={styles.cards}>{games.map(g=>{const contents=<><GameScenery game={g.scene} className={styles.cardScene}><LearningMascot kind={g.id} size={132}/></GameScenery><div className={styles.cardBody}><span>{g.tag}</span><h3><span aria-label={"遊戲編號 "+gameNumber("learn-"+g.id)}>{String(gameNumber("learn-"+g.id)).padStart(2,"0")} · </span>{g.title}</h3><p>{g.description}</p><b>{g.ready?"開始學習 →":"正在製作"}</b></div></>;return g.ready?<Link key={g.id} href={"/learn/"+g.id}>{contents}</Link>:<article key={g.id} className={styles.coming}>{contents}</article>;})}</div></section><section className={styles.panel}><h2>每次答錯，都有下一個線索。</h2><p>每題都有提示與解析，英文可點擊聽發音。<br/>練習模式可以慢慢想；挑戰模式有三顆愛心。<br/>常錯的內容會收進錯題本，之後再回來練習。</p></section></LearningShell>;
}
