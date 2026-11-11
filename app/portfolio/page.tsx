import type { Metadata } from "next";
import PortfolioPageRedirect from "@/components/PortfolioPageRedirect";

export const metadata: Metadata = {
  title: "作品集｜艾飛樂",
  alternates: { canonical: "/story/" },
  robots: { index: false, follow: true },
};

export default function PortfolioPage() { return <PortfolioPageRedirect />; }
