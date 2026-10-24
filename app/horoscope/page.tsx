import type { Metadata } from "next";
import ZodiacFortune from "@/components/horoscope/ZodiacFortune";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: `星座運勢 ｜ ${SITE.brand}`,
  description: "選擇你的星座，查看今日運勢、個性與星座配對。",
};

export default function HoroscopePage() {
  return <ZodiacFortune />;
}
