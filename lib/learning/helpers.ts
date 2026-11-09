import type {Question} from "./types";
export function shuffle<T>(items:T[]):T[]{const next=[...items];for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]];}return next;}
export function normalize(value:string){return value.normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g," ").trim().replace(/\s+([,.!?;:])/g,"$1");}
export function isCorrect(question:Question,answer:string|string[]){if(question.kind==="choice")return typeof answer==="string"&&normalize(answer)===normalize(question.correct);if(!Array.isArray(answer))return false;const joiner=question.lang==="zh"?"":" ";return(question.solutions||[]).some(solution=>normalize(solution.join(joiner))===normalize(answer.join(joiner)));}
export function makeRound(pool:Question[]){return shuffle(pool).slice(0,6).map(q=>({...q,options:q.options?shuffle(q.options):undefined}));}
export function makeTiles(question:Question){return shuffle((question.tiles||question.solutions?.[0]||[]).map((text,id)=>({id,text})));}

