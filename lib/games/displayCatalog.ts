import {ARCADE_GAMES,GAME_CATEGORIES} from "./catalog";
import {LEARNING_GAMES} from "@/lib/learning/catalog";

const games=[
 ...ARCADE_GAMES.map(g=>({id:g.slug,title:g.title,info:g.category,group:g.group,href:"/games/"+g.slug,scene:g.slug,learning:false as const})),
 ...LEARNING_GAMES.filter(g=>g.ready).map(g=>({id:"learn-"+g.id,title:g.title,info:g.tag,group:"language" as const,href:"/learn/"+g.id,scene:g.scene,kind:g.id,learning:true as const})),
];
export const NUMBERED_GAMES=GAME_CATEGORIES.flatMap(category=>
 games.filter(game=>game.group===category.id)
).map((game,index)=>({...game,number:index+1}));
export function gameNumber(id:string){return NUMBERED_GAMES.find(game=>game.id===id)?.number;}
