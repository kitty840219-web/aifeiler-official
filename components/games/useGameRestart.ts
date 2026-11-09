"use client";
import {useEffect,useRef} from "react";
import {REPLAY_EVENT} from "@/lib/games/feedback";
export function useGameRestart(game:string,restart:()=>void){const latest=useRef(restart);useEffect(()=>{latest.current=restart;});useEffect(()=>{const replay=(event:Event)=>{if((event as CustomEvent<string>).detail===game)latest.current();};window.addEventListener(REPLAY_EVENT,replay);return()=>window.removeEventListener(REPLAY_EVENT,replay);},[game]);}
