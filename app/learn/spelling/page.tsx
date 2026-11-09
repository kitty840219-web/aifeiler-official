import type {Metadata} from "next";
import LearningGame from "@/components/learning/LearningGame";
export const metadata:Metadata={title:"單字拼拼樂｜小艾語言學習館",description:"從小學到大學分級練習英文拼字，點字母作答，搭配發音、例句、提示與錯題複習。"};
export default function Page(){return <LearningGame kind="spelling"/>;}
