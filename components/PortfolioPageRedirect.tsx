"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PortfolioPageRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/story#story-portfolio"); }, [router]);
  return <div className="px-5 py-16 text-center text-paper">
    <p>作品集已整合至品牌故事。</p>
    <Link href="/story#story-portfolio" className="mt-5 inline-block underline">前往作品集 →</Link>
  </div>;
}
