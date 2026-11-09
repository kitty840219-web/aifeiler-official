import type {ReactNode} from "react";
import {sceneVariables} from "@/lib/games/backgrounds";
import styles from "./GameScenery.module.css";
export default function GameScenery({game,children,className=""}:{game:string;children:ReactNode;className?:string}){
 return <div className={`${styles.scene} ${className}`} style={sceneVariables(game)} data-scenery={game}>{children}</div>;
}
