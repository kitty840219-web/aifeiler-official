import {asset} from "@/lib/basePath";
import {LEARNING_GAMES} from "@/lib/learning/catalog";
import type {LearningKind} from "@/lib/learning/types";
export default function LearningMascot({kind="spelling",size=160}:{kind?:LearningKind;size?:number}){
 const index=LEARNING_GAMES.find(g=>g.id===kind)?.art||0;
 return <span role="img" aria-label="陪你學習的小艾" data-learning-mascot={kind} style={{display:"inline-block",flexShrink:0,width:size,height:size,backgroundImage:'url("'+asset("/images/learning/xiaoai-teachers.webp")+'")',backgroundSize:"300% 200%",backgroundPosition:(index%3*50)+"% "+(Math.floor(index/3)*100)+"%",backgroundRepeat:"no-repeat",verticalAlign:"middle"}}/>;
}
