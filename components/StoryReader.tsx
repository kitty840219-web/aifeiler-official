"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Chapter } from "@/lib/data/story";

export default function StoryReader({
  chapters,
  finish,
}: {
  chapters: Chapter[];
  finish?: { label: string; onClick: () => void };
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const total = chapters.length;
  const chapter = chapters[index];
  const num = String(index + 1).padStart(2, "0");
  const isLast = index === total - 1;
  const finishLabel = finish?.label ?? "故事讀完了，看看最新文章 →";

  const advance = () => {
    if (!isLast) {
      setIndex((i) => Math.min(total - 1, i + 1));
    } else if (finish) {
      finish.onClick();
    } else {
      router.push("/works");
    }
  };

  return (
    <div>
      {/* level map */}
      <div className="pb-2">
        <div className="relative mx-auto grid w-full grid-cols-6 justify-items-center gap-x-1 gap-y-5 px-2 sm:gap-x-2 sm:px-4">
          {chapters.map((c, i) => {
            const active = i === index;
            return (
              <button
                key={c.tag}
                type="button"
                onClick={() => setIndex(i)}
                className="group relative flex min-w-0 flex-col items-center gap-2"
              >
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-serif text-xs font-bold shadow-card transition sm:h-12 sm:w-12 sm:text-sm ${
                    active
                      ? "border-gold bg-gold text-night-dark"
                      : "border-gold/70 bg-night-dark text-gold-light group-hover:border-gold group-hover:bg-night"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-center text-[10px] font-medium leading-tight transition sm:text-xs ${
                    active ? "text-gold-light" : "text-paper/70 group-hover:text-gold-light"
                  }`}
                >
                  {c.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] tracking-widest text-paper/55">
        第 {num} / {String(total).padStart(2, "0")} 章・點選節點跳至該章
      </p>

      {/* reading panel */}
      <div className="mx-auto mt-10 max-w-2xl px-4 sm:px-6">
        <div
          role="button"
          tabIndex={0}
          onClick={advance}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              advance();
            }
          }}
          aria-label={isLast ? finishLabel : "點擊查看下一章"}
          className="bg-grain group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-[#d9c79f]/35 bg-[#f5ecd8] p-6 shadow-soft transition sm:p-9"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#efe3c8]/70 via-transparent to-white/40" />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#94601d]">
              艾飛樂的故事 ・ {chapter.tag.toUpperCase()} ・ 第 {num} / {String(total).padStart(2, "0")} 章
            </p>
            <h3 className="mt-2 font-serif text-xl font-bold text-[#3b326c] sm:text-2xl">{chapter.title}</h3>

            <div className="mt-5 space-y-4 text-justify text-sm leading-loose text-[#514a78] sm:text-base">
              {chapter.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {chapter.embed && (
              <div className="mt-5" onClick={(e) => e.stopPropagation()}>
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-black">
                  <iframe
                    title={`${chapter.title} 影音`}
                    src={`https://www.youtube.com/embed/${chapter.embed.videoId}?rel=0`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <a
                  href={chapter.embed.channelHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-semibold text-[#94601d]"
                >
                  前往頻道 →
                </a>
              </div>
            )}

            {chapter.quote && (
              <blockquote className="mt-6 border-l-4 border-[#bf8428] py-1 pl-4 font-serif text-base italic text-[#94601d] sm:text-lg">
                「{chapter.quote}」
              </blockquote>
            )}

            {chapter.link && (
              <Link
                href={chapter.link.href}
                onClick={(e) => e.stopPropagation()}
                className="mt-5 inline-block text-xs font-semibold text-[#94601d]"
              >
                {chapter.link.label}
              </Link>
            )}

            <p className="mt-6 text-right text-xs font-semibold text-[#94601d] transition group-hover:text-[#6f4512]">
              {isLast ? finishLabel : "點擊繼續下一章 →"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
