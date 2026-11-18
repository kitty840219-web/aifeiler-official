import type { Metadata } from "next";
import { redirect } from "next/navigation";

const portfolioUrl = "https://aifeiler0219.my.canva.site/";

export const metadata: Metadata = {
  title: "作品集｜艾飛樂",
  alternates: { canonical: portfolioUrl },
  robots: { index: false, follow: true },
};

export default function PortfolioPage() {
  redirect(portfolioUrl);
}
