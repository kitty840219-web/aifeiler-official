import type { Metadata } from "next";
import GameHub from "@/components/games/GameHub";
export const metadata: Metadata = { title: "艾飛樂星光遊樂園｜艾飛樂", description: "免費玩小艾翻翻樂、星光接接樂與心情花園，收集屬於你的星光。" };
export default function Page() { return <GameHub />; }
