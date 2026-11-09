"use client";
import {useSyncExternalStore} from "react";
import type {LevelId} from "./types";
type RecordEntry={best:number;sessions:number;correct:number;questions:number};
type LearningProgress={level:LevelId;records:Record<string,RecordEntry>;mistakes:Record<string,number>};
const KEY="aifeiler-learning-v1",EVENT="aifeiler-learning-change";
const EMPTY:LearningProgress={level:"p1",records:{},mistakes:{}};
let cached=EMPTY,cachedRaw:string|null=null,inMemory=false;
const levels=["p1","p2","p3","junior","senior","college"];
function read():LearningProgress{if(typeof window==="undefined")return EMPTY;if(inMemory)return cached;try{const raw=localStorage.getItem(KEY)||"";if(raw===cachedRaw)return cached;cachedRaw=raw;if(!raw){cached=EMPTY;return cached;}const value=JSON.parse(raw);const records:Record<string,RecordEntry>={},mistakes:Record<string,number>={};if(value&&typeof value==="object"){for(const[k,v]of Object.entries(value.records||{}).slice(-200)){const n=v as Partial<RecordEntry>;if(n&&[n.best,n.sessions,n.correct,n.questions].every(x=>typeof x==="number"&&Number.isFinite(x)&&x>=0))records[k]=n as RecordEntry;}for(const[k,v]of Object.entries(value.mistakes||{}).slice(-1000))if(typeof v==="number"&&Number.isFinite(v)&&v>0)mistakes[k]=v;}cached={level:levels.includes(value?.level)?value.level:"p1",records,mistakes};return cached;}catch{return cached;}}
function subscribe(notify:()=>void){window.addEventListener(EVENT,notify);window.addEventListener("storage",notify);return()=>{window.removeEventListener(EVENT,notify);window.removeEventListener("storage",notify);};}
export function updateLearning(change:(p:LearningProgress)=>LearningProgress){cached=change(read());cachedRaw=JSON.stringify(cached);try{localStorage.setItem(KEY,cachedRaw);}catch{inMemory=true;}window.dispatchEvent(new Event(EVENT));}
export function setLearningLevel(level:LevelId){updateLearning(p=>({...p,level}));}
export function noteMistake(id:string){updateLearning(p=>({...p,mistakes:{...p.mistakes,[id]:(p.mistakes[id]||0)+1}}));}
export function clearMistake(id:string){updateLearning(p=>{const mistakes={...p.mistakes};delete mistakes[id];return{...p,mistakes};});}
export function recordLearning(key:string,score:number,correct:number,questions:number){updateLearning(p=>{const old=p.records[key]||{best:0,sessions:0,correct:0,questions:0};return{...p,records:{...p.records,[key]:{best:Math.max(old.best,score),sessions:old.sessions+1,correct:old.correct+correct,questions:old.questions+questions}}};});}
export function useLearningProgress(){return useSyncExternalStore(subscribe,read,()=>EMPTY);}

