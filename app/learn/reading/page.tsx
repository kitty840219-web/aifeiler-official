import type {Metadata} from "next";
import LearningGame from "@/components/learning/LearningGame";
export const metadata:Metadata={title:"雙語閱讀尋寶｜小艾語言學習館",description:"從小學到大學分級練習，支援觸碰作答、提示、解析與錯題複習。"};
export default function Page(){return <LearningGame kind="reading"/>;}
