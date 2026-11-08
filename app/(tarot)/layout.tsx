import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "塔羅占卜 ｜ 艾飛樂語錄",
  description: "單張、三張與感情五張牌占卜，提供個人解牌報告、JPG 下載與歷史紀錄。",
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-night-dark">{children}</div>;
}
