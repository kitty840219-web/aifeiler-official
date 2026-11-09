import type {Metadata} from "next";
import LearningHub from "@/components/learning/LearningHub";
export const metadata:Metadata={title:"小艾語言學習館｜艾飛樂",description:"按學段練習國文、英文拼字、成語與句子，支援手機觸碰、發音與錯題複習。"};
export default function Page(){return <LearningHub/>;}
