import type { CSSProperties } from "react";
import { asset } from "@/lib/basePath";
import { GAME_ART } from "@/lib/games/art";
export default function GameMascot({ game, size = 128, alt = "", className, style }: { game: string; size?: number; alt?: string; className?: string; style?: CSSProperties }) {
 const art = GAME_ART[game]; if (!art) return null;
 const x = art.index % art.columns, y = Math.floor(art.index / art.columns);
 return <span className={className} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} data-mascot={game} style={{ display:"inline-block", width:size, height:size, flexShrink:0, backgroundImage:`url("${asset(art.src)}")`, backgroundRepeat:"no-repeat", backgroundSize:`${art.columns*100}% ${art.rows*100}%`, backgroundPosition:`${art.columns===1?0:x/(art.columns-1)*100}% ${art.rows===1?0:y/(art.rows-1)*100}%`, verticalAlign:"middle", ...style }} />;
}
