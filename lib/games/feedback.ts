export type FeedbackKind="success"|"error"|"miss"|"info"|"finish";
export type GameNotice={game:string;kind:FeedbackKind;message:string;points?:number;score?:number;outcome?:"win"|"over"|"draw"|"complete";reward?:number;best?:number;stats?:{label:string;value:string}[];canRestart?:boolean};
export const FEEDBACK_EVENT="aifeiler-game-feedback";
export const REPLAY_EVENT="aifeiler-game-replay";
const SOUND_EVENT="aifeiler-game-sound-change";
let context:AudioContext|null=null,enabled=true,lastSound=0;
export function soundEnabled(){try{return localStorage.getItem("aifeiler-game-sound")!=="off";}catch{return enabled;}}
export function setSoundEnabled(value:boolean){enabled=value;try{localStorage.setItem("aifeiler-game-sound",value?"on":"off");}catch{}window.dispatchEvent(new Event(SOUND_EVENT));if(value)unlockGameAudio();}
export function subscribeSound(notify:()=>void){window.addEventListener(SOUND_EVENT,notify);window.addEventListener("storage",notify);return()=>{window.removeEventListener(SOUND_EVENT,notify);window.removeEventListener("storage",notify);};}
export function unlockGameAudio(){if(!soundEnabled())return;try{const Audio=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Audio)return;if(!context)context=new Audio();if(context.state==="suspended")void context.resume().catch(()=>{});}catch{/* Feedback graphics remain available. */}}
export function playGameSound(kind:FeedbackKind,outcome?:GameNotice["outcome"]){if(!soundEnabled()||!context)return;const now=performance.now();if(kind!=="finish"&&now-lastSound<120)return;lastSound=now;
 const notes=kind==="finish"?(outcome==="over"?[294,247,196]:[523,659,784,1047]):kind==="error"?[262,196]:kind==="miss"?[220,165]:kind==="info"?[440]:[659,880];
 try{notes.forEach((frequency,i)=>{const oscillator=context!.createOscillator(),gain=context!.createGain(),at=context!.currentTime+i*(kind==="finish"?.12:.07);oscillator.type=kind==="error"||kind==="miss"?"triangle":"sine";oscillator.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.065,at+.012);gain.gain.exponentialRampToValueAtTime(.001,at+.17);oscillator.connect(gain);gain.connect(context!.destination);oscillator.start(at);oscillator.stop(at+.19);});}catch{/* An unavailable audio device must not interrupt play. */}}
export function gameNotice(game:string,kind:FeedbackKind,message:string,points?:number){if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent<GameNotice>(FEEDBACK_EVENT,{detail:{game,kind,message,points}}));}
export function gameResult(game:string,result:Omit<GameNotice,"game"|"kind">){if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent<GameNotice>(FEEDBACK_EVENT,{detail:{...result,game,kind:"finish"}}));}
