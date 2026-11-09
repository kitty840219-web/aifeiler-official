"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutPageRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/story#about-author"); }, [router]);
  return <div className="px-5 py-16 text-center text-paper">
    <p>關於作者已整合至品牌故事下方。</p>
    <Link href="/story#about-author" className="mt-5 inline-block underline">前往關於作者 →</Link>
  </div>;
}
