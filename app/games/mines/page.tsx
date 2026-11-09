import type { Metadata } from "next";
import { MinesGame } from "@/components/games/arcade/PuzzleGames";
export const metadata: Metadata={title:"星光踩地雷｜艾飛樂立體遊戲館"};
export default function Page(){return <MinesGame/>;}
