import type { Metadata } from "next";
import SolitaireGame from "@/components/games/arcade/SolitaireGame";
export const metadata: Metadata={title:"小艾紙牌接龍｜艾飛樂立體遊戲館"};
export default function Page(){return <SolitaireGame/>;}
