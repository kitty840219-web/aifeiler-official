import type { Metadata } from "next";
import Image from "next/image";
import ArticleList from "@/components/ArticleList";
import Star from "@/components/Star";
import { ARTICLES } from "@/lib/data/articles";
import { SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = { title: `最新文章 ｜ ${SITE.brand}`, description: "艾飛樂最新文章與語錄創作。" };

export default function WorksPage() {
  return <div className="min-h-screen bg-night-dark">
    <section className="relative overflow-hidden bg-night-dark pb-6 pt-8 text-center">
      <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-3 flex items-center justify-center gap-2"><Star className="h-3 w-3 text-gold-light" /><p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">LATEST</p><Star className="h-3 w-3 text-gold-light" delay="1s" /></div>
        <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">最新文章</h1>
      </div>
      <div className="animate-glow-pulse relative mx-auto mt-4 h-40 w-40"><Image src={asset("/images/latest-articles-cutout.webp")} alt="小艾坐著書寫最新文章" fill className="object-contain" sizes="160px" /></div>
      <div className="relative mt-4 overflow-hidden"><div className="animate-marquee flex w-max whitespace-nowrap">
        <span className="pr-16 font-serif text-lg text-paper sm:text-xl">「{SITE.tagline}，{SITE.taglineSub}。」</span>
        <span aria-hidden className="pr-16 font-serif text-lg text-paper sm:text-xl">「{SITE.tagline}，{SITE.taglineSub}。」</span>
      </div></div>
    </section>
    <section className="relative overflow-hidden bg-night-dark pb-16 pt-4">
      <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative">
        <ArticleList articles={ARTICLES} />
      </div>
    </section>
  </div>;
}
