"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/data/articles";
import Star from "@/components/Star";
import TagChip from "@/components/TagChip";
import { asset } from "@/lib/basePath";
import { ARTICLE_THUMBNAILS } from "@/lib/data/imageThumbnails";

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null);
  const [category, setCategory] = useState("最新語錄");
  const preferredCategories = ["最新語錄", "最新短片", "最新MV", "工具小幫手", "服務資訊", "系統維護"];
  const articleTags = Array.from(new Set(articles.map((article) => article.tag)));
  const categories = [
    "全部文章",
    ...preferredCategories.filter((tag) => tag === "最新短片" || articleTags.includes(tag)),
    ...articleTags.filter((tag) => !preferredCategories.includes(tag)),
  ];
  const newestFirst = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const displayedArticles = category === "全部文章"
    ? newestFirst.filter((article) => article.tag !== "系統維護")
    : newestFirst.filter((article) => article.tag === category);

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
      <div className="mx-auto max-w-[92rem] px-4">
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

        <div className={category === "系統維護" ? "mx-auto max-w-5xl divide-y divide-[#b9adc6] border-y border-[#b9adc6]" : "article-case-grid"}>
        {displayedArticles.map((a, index) => a.tag === "系統維護" ? (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="maintenance-title-row block w-full px-2 py-4 text-center text-[#2b2a5c] transition hover:bg-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#514368] sm:px-4"
            style={{ gridColumn: "1 / -1" }}
          >
            <h3 className="font-serif font-semibold leading-relaxed" style={{ fontSize: "15px" }}>{a.title.replace(/^\d{4}-\d{2}-\d{2}｜/, "")}</h3>
          </button>
        ) : (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="article-case-card group text-left transition hover:-translate-y-1"
          >
            <div className="article-case-image relative overflow-hidden bg-paper">
              {a.youtubeId ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${a.youtubeId}/hqdefault.jpg`} alt={`${a.title}影片封面`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span aria-hidden="true" className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-xl text-[#2b2a5c] shadow">▶</span></span>
                </>
              ) : (a.heroImage || a.image) ? (
                <Image
                  src={asset(ARTICLE_THUMBNAILS[a.heroImage || a.image || ""] || a.heroImage || a.image || "")}
                  alt={`${a.title}主題插畫`}
                  fill
                  className="object-contain transition duration-500"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={index < 2}
                />
              ) : null}
              <span className="article-case-tag absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-bold">{a.tag}</span>
            </div>
            <div className="article-case-info relative z-10 mx-5 -mt-10 px-6 pb-8 pt-6">
              <div className="article-case-meta flex items-center justify-between gap-3 text-xs text-[#514d70]">
                <span className="article-case-author">{a.tag === "系統維護" ? "艾飛樂系統更新" : "艾飛樂創作分享"}</span>
                <time dateTime={a.date}>{a.date}</time>
              </div>
              <h3 className="article-case-title mt-3 font-serif text-xl font-bold leading-snug text-[#2b2a5c]">{a.title}</h3>
              <p className="article-case-excerpt mt-3 line-clamp-3 text-sm leading-relaxed text-[#403d61]">{a.excerpt}</p>
              <p className="article-case-read-more mt-5 text-sm font-bold text-gold-dark">{a.youtubeId ? (a.tag === "最新MV" ? "觀看 MV →" : "觀看短片 →") : "閱讀全文 →"}</p>
            </div>
          </button>
        ))}
        </div>
        {displayedArticles.length === 0 && (
          <div className="rounded-[2rem] border border-gold/20 bg-white/65 px-6 py-14 text-center text-paper shadow-card">
            <p className="font-serif text-2xl font-bold">{category === "最新短片" ? "最新短片即將更新" : `${category}即將更新`}</p>
            <p className="mt-3 text-sm text-paper/65">{category === "最新短片" ? "新的影音創作將在這裡與你見面。" : "下一篇想留下的話，正在慢慢寫成圖與故事。"}</p>
          </div>
        )}
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
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-[1.5rem] border border-gold/30 bg-white p-6 text-[#2b2a5c] shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-3 flex items-center gap-2">
                <Star className="h-3 w-3 text-gold-light" />
                <TagChip tone="gold">{selected.tag}</TagChip>
                <span className="text-xs text-[#514d70]">{selected.date}</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#2b2a5c]">{selected.tag === "系統維護" ? selected.title.replace(/^\d{4}-\d{2}-\d{2}｜/, "") : selected.title}</h2>
              {selected.youtubeId && (
                <div className="relative mx-auto mt-4 aspect-[9/16] w-full max-w-[320px] shrink-0 overflow-hidden rounded-2xl bg-black">
                  <iframe
                    title={selected.title}
                    src={`https://www.youtube.com/embed/${selected.youtubeId}?playsinline=1`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
              {selected.heroImage && (
                <div className="relative mt-4 aspect-square w-full shrink-0 overflow-hidden rounded-2xl border border-gold/20 bg-white">
                  <Image src={asset(selected.heroImage)} alt={`${selected.title}主題插畫`} fill className="object-contain" sizes="398px" />
                </div>
              )}
              {selected.galleryImages?.map((image) => (
                <div
                  key={image.src}
                  className={`relative mt-4 w-full shrink-0 overflow-hidden rounded-2xl border border-gold/20 bg-white ${
                    image.aspect === "portrait" ? "aspect-[3/4]" : image.aspect === "square" ? "aspect-square" : "aspect-[3/2]"
                  }`}
                >
                  <Image src={asset(image.src)} alt={image.alt} fill className="object-contain" sizes="398px" />
                </div>
              ))}
              <div className="mt-4 space-y-4 whitespace-pre-line break-words text-sm leading-7 text-[#403d61]">
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
