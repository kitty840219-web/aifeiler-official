export type TouchPoint = {x:number;y:number};
export function directionTo(from:TouchPoint,to:TouchPoint) {
 const dx=to.x-from.x,dy=to.y-from.y;
 if(Math.abs(dx)<.1&&Math.abs(dy)<.1)return null;
 return Math.abs(dx)>Math.abs(dy)?dx>0?"ArrowRight":"ArrowLeft":dy>0?"ArrowDown":"ArrowUp";
}
// Breadth-first search uses only walkable tiles; a wall tap selects the nearest reachable tile.
export function mazePath(grid:number[][],start:TouchPoint,target:TouchPoint):TouchPoint[] {
 const key=(p:TouchPoint)=>`${p.x},${p.y}`;
 const parents=new Map<string,TouchPoint|null>([[key(start),null]]),queue=[start];
 let closest=start,best=Math.abs(start.x-target.x)+Math.abs(start.y-target.y);
 for(let i=0;i<queue.length;i++){
  const p=queue[i],distance=Math.abs(p.x-target.x)+Math.abs(p.y-target.y);
  if(distance<best){best=distance;closest=p;}
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next={x:p.x+dx,y:p.y+dy};
   if(grid[next.y]?.[next.x]===0&&!parents.has(key(next))){parents.set(key(next),p);queue.push(next);}
  }
 }
 const path:TouchPoint[]=[];let p:TouchPoint|null=closest;
 while(p&&key(p)!==key(start)){path.unshift(p);p=parents.get(key(p))||null;}
 return path;
}
