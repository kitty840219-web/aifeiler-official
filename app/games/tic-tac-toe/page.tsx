import type { Metadata } from "next";
import { TicTacToeGame } from "@/components/games/arcade/PuzzleGames";
export const metadata: Metadata={title:"立體圈叉｜艾飛樂立體遊戲館"};
export default function Page(){return <TicTacToeGame/>;}
