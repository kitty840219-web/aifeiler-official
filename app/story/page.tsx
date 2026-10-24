import type { Metadata } from "next";
import Image from "next/image";
import Star from "@/components/Star";
import StoryReader from "@/components/StoryReader";
import { SITE } from "@/lib/data/site";
import { CHAPTERS } from "@/lib/data/story";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `艾飛樂的故事 ｜ ${SITE.brand}`,
  description: "從一個人的塗塗畫畫，到艾飛樂語錄——一段用插畫與文字寫成的品牌故事。",
};

export default function StoryPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-2 pt-16 text-center">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Star className="h-3 w-3 text-gold-light" />
            <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">OUR STORY</p>
            <Star className="h-3 w-3 text-gold-light" delay="1s" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">艾飛樂的故事</h1>
          <p className="mt-2 text-sm text-paper/80 sm:text-base">一段用插畫與文字，寫給每個黑夜的旅程</p>
        </div>
      </section>

      {/* character card */}
      <section className="relative overflow-hidden bg-night-dark px-4 pb-6 pt-6 text-center sm:px-6">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center">
          <div className="relative mb-5 h-40 w-40 shrink-0 overflow-hidden rounded-full border-4 border-gold/40 bg-paper shadow-soft sm:h-48 sm:w-48">
            <Image src={asset("/images/profile.webp")} alt="艾飛樂創作者 Ivy" fill className="object-cover" sizes="192px" priority />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-gold-light">
              STORYTELLER · 說故事的人
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-paper sm:text-2xl">
              {SITE.founder}｜用插畫說故事的人
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-paper/70">
              {SITE.brandFull}創作者。相信每一句心事，都值得被畫成一顆星星。
            </p>
          </div>
        </div>
      </section>

      {/* paginated dialogue reader */}
      <section className="relative overflow-hidden bg-night-dark pb-16 pt-2">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative">
          <StoryReader chapters={CHAPTERS} />
        </div>
      </section>

    </div>
  );
}
