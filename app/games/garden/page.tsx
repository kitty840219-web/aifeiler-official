import type { Metadata } from "next";
import GardenGame from "@/components/games/GardenGame";
export const metadata: Metadata = { title: "小艾的心情花園｜艾飛樂", description: "選擇今天的心情，種下一朵花，打造自己的療癒小花園。" };
export default function Page() { return <GardenGame />; }
