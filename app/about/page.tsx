import type { Metadata } from "next";
import AboutPageRedirect from "@/components/AboutPageRedirect";

export const metadata: Metadata = {
  title: "關於作者｜艾飛樂",
  alternates: { canonical: "/story/" },
};

export default function AboutPage() { return <AboutPageRedirect />; }
