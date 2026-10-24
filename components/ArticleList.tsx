"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/data/articles";
import Star from "@/components/Star";
import TagChip from "@/components/TagChip";
import { asset } from "@/lib/basePath";

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null);
  const [category, setCategory] = useState("全部文章");
  const categories = ["全部文章", ...Array.from(new Set(articles.map((article) => article.tag)))];
  const displayedArticles = category === "全部文章" ? articles : articles.filter((article) => article.tag === category);

  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-9 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold tracking-wide transition sm:px-7 sm:text-base ${
                category === item
                  ? "border-paper-dark bg-paper-dark text-night-dark shadow-soft"
                  : "border-paper/35 bg-white/10 text-paper hover:border-paper/70 hover:bg-white/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-7 md:grid-cols-2">
        {displayedArticles.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="group overflow-hidden rounded-[2rem] border border-gold/20 bg-white/85 text-left text-paper shadow-card transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-night-light/25">
              {(a.heroImage || a.image) ? (
                <Image
                  src={asset(a.heroImage || a.image || "")}
                  alt={`${a.title}主題插畫`}
                  fill
                  className={a.heroImage ? "object-cover transition duration-500 group-hover:scale-105" : "object-contain p-6 transition duration-500 group-hover:scale-105"}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              ) : null}
              <span className="absolute left-5 top-5 rounded-full bg-night-dark/85 px-3 py-1.5 text-xs font-bold text-paper">{a.tag}</span>
            </div>
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 text-xs text-night-light/65">
                <span>艾飛樂創作分享</span>
                <time>{a.date}</time>
              </div>
              <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-paper sm:text-2xl">{a.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-paper/70 sm:text-base">{a.excerpt}</p>
              <p className="mt-5 text-sm font-bold text-gold-dark">閱讀全文 →</p>
            </div>
          </button>
        ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8"
          onClick={() => setSelected(null)}
        >
          <div className="relative h-full max-h-[85svh] w-full max-w-[430px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="關閉文章"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-xl font-bold text-night-dark shadow-soft transition hover:bg-gold-light"
            >
              ✕
            </button>
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-[1.5rem] border border-gold/30 bg-night-dark p-6 text-paper shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-3 flex items-center gap-2">
                <Star className="h-3 w-3 text-gold-light" />
                <TagChip tone="gold">{selected.tag}</TagChip>
                <span className="text-xs text-paper/55">{selected.date}</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-paper">{selected.title}</h2>
              {selected.heroImage && (
                <div className="relative mt-4 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl border border-gold/20">
                  <Image src={asset(selected.heroImage)} alt={`${selected.title}主題插畫`} fill className="object-cover" sizes="398px" />
                </div>
              )}
              <div className="mt-4 space-y-4 text-sm leading-7 text-paper/85">
                {selected.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {selected.link && (
                <Link
                  href={selected.link.href}
                  className="mt-6 block rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-night-dark transition hover:bg-gold-light"
                >
                  {selected.link.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
