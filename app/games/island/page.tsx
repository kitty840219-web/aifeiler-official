import type { Metadata } from "next";
import ActionGame from "@/components/games/arcade/ActionGame";
export const metadata:Metadata={title:"小艾冠軍小島｜艾飛樂互動遊戲",description:"艾飛樂原創立體風格小遊戲，支援手機觸控及鍵盤操作。"};
export default function Page(){return <ActionGame game="island"/>;}
