import type { Metadata } from "next";
import StarGame from "@/components/games/StarGame";
export const metadata: Metadata = { title: "星光接接樂｜艾飛樂", description: "移動小艾接住星光、躲開烏雲，挑戰30秒的星光紀錄。" };
export default function Page() { return <StarGame />; }
