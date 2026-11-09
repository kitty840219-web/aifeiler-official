import type {Metadata} from "next";
import DailyQuote from "@/components/quotes/DailyQuote";
export const metadata:Metadata={title:"每日一句｜艾飛樂字卡試作",description:"10張月份主題中英文語錄字卡，抽一句溫柔，聽英文、收藏並下載桌布。"};
export default function Page(){return <DailyQuote/>;}
