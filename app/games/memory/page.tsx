import type { Metadata } from "next";
import MemoryGame from "@/components/games/MemoryGame";
export const metadata: Metadata = { title: "小艾翻翻樂｜艾飛樂", description: "翻開小艾插畫卡片，挑戰記憶配對，收集療癒星光。" };
export default function Page() { return <MemoryGame />; }
