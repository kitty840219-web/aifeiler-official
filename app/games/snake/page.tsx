import type { Metadata } from "next";
import SnakeGame from "@/components/games/arcade/SnakeGame";
export const metadata: Metadata = { title: "小艾貪食蛇｜艾飛樂立體遊戲館", description: "手機與電腦都能玩的立體風格貪食蛇，吃蘋果、挑戰高分。" };
export default function Page() { return <SnakeGame />; }
