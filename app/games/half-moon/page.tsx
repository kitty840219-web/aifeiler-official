import type { Metadata } from "next";
import { MoonGame } from "@/components/games/arcade/PuzzleGames";
export const metadata: Metadata={title:"半月星牌｜艾飛樂立體遊戲館"};
export default function Page(){return <MoonGame/>;}
