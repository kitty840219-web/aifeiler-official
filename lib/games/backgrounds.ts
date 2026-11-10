import type { CSSProperties } from "react";
import { asset } from "@/lib/basePath";
type BackgroundArt={src:string;columns:number;rows:number;index:number};
export const BACKGROUND_ART:Record<string,BackgroundArt>={
  "memory": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 0
  },
  "stars": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 1
  },
  "garden": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 2
  },
  "snake": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 3
  },
  "mines": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 4
  },
  "tic-tac-toe": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 5
  },
  "tiles": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 6
  },
  "half-moon": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 7
  },
  "pani-puri": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 8
  },
  "ocean-memory": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 9
  },
  "solitaire": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 10
  },
  "baseball": {
    "src": "/images/games/backgrounds-a.webp",
    "columns": 3,
    "rows": 4,
    "index": 11
  },
  "cricket": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 0
  },
  "breakout": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 1
  },
  "maze": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 2
  },
  "gnomes": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 3
  },
  "pony": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 4
  },
  "popcorn": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 5
  },
  "petanque": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 6
  },
  "platform": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 7
  },
  "island": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 8
  },
  "halloween": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 9
  },
  "hub": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 10
  },
  "victory": {
    "src": "/images/games/backgrounds-b.webp",
    "columns": 3,
    "rows": 4,
    "index": 11
  }
};
export function sceneVariables(game:string):CSSProperties {
 const art=BACKGROUND_ART[game]||BACKGROUND_ART.hub;
 return {"--game-bg":`url("${asset(art.src)}")`,"--game-bg-size":`${art.columns*100}% ${art.rows*100}%`,"--game-bg-position":`${art.index%art.columns/(art.columns-1)*100}% ${Math.floor(art.index/art.columns)/(art.rows-1)*100}%`} as CSSProperties;
}
