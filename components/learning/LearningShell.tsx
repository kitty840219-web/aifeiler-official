"use client";
import {useRouter} from "next/navigation";
import type {ReactNode} from "react";
import GameScenery from "@/components/games/GameScenery";
import LearningMascot from "./LearningMascot";
import type {LearningKind} from "@/lib/learning/types";
import styles from "./Learning.module.css";
export default function LearningShell({title,description,kind,children,showArt=true}:{title:string;description:string;kind?:LearningKind;children:ReactNode;showArt?:boolean}){
 const router=useRouter();
 return <div data-game-page="" className={styles.world}><nav className={styles.topNav} aria-label="學習館導覽"><button type="button" className={styles.backLink} onClick={()=>{if(window.history.length>1){router.back();}else{router.replace("/games/");}}}>← 回上一頁</button></nav><header className={styles.header}><p className={styles.eyebrow}>AIFEILER · LITTLE LANGUAGE ADVENTURES</p><h1>{title}</h1><p>{description}</p></header>{showArt&&<GameScenery game="memory" className={styles.hero}><LearningMascot kind={kind}/></GameScenery>}{children}<details className={styles.sources}><summary>分級與參考資料</summary><p>本館以學段推薦練習起點，可自由切換。題目與情境為原創，字詞釋義及分級方向參考下列資源。</p><ul><li><a href="https://dict.idioms.moe.edu.tw/" target="_blank" rel="noopener noreferrer">教育部《成語典》</a></li><li><a href="https://dict.concised.moe.edu.tw/" target="_blank" rel="noopener noreferrer">教育部《國語辭典簡編本》</a></li><li><a href="https://teric.naer.edu.tw/wSite/ct?ctNode=648&mp=teric_m&xItem=2066485" target="_blank" rel="noopener noreferrer">國家教育研究院：中小學英語字彙研究</a></li><li><a href="https://learnenglish.britishcouncil.org/level/understand-your-english-level" target="_blank" rel="noopener noreferrer">British Council 英語能力分級</a></li><li><a href="https://www.britishcouncil.ps/en/teach/apps/phonics-stories-schools" target="_blank" rel="noopener noreferrer">British Council 兒童拼讀學習設計</a></li></ul></details><p className={styles.footer}>學段、成績與錯題保存在這台裝置的瀏覽器。<br/>跟著小艾，讓每次練習都多懂一點。</p></div>;
}
