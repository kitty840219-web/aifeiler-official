"use client";
import {LEVELS} from "@/lib/learning/catalog";
import {setLearningLevel,useLearningProgress} from "@/lib/learning/progress";
import styles from "./Learning.module.css";
export default function LevelPicker(){
 const {level}=useLearningProgress();
 return <div><div className={styles.levels} role="group" aria-label="選擇學段">{LEVELS.map(l=><button type="button" key={l.id} aria-pressed={level===l.id} onClick={()=>setLearningLevel(l.id)}><b>{l.label}</b><span>{l.age}</span></button>)}</div><p className={styles.small}>學段是建議起點，隨時可以換難度。小學分低、中、高年級。</p></div>;
}
