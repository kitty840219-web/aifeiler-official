import type { Metadata } from "next";
import Image from "next/image";
import LineGuideCarousel from "@/components/LineGuideCarousel";
import Star from "@/components/Star";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `如何使用官方 LINE ｜ ${SITE.brand}`,
  description: "艾飛樂官方 LINE 使用教學：新選單功能導覽，以及大眾占卜／心理測驗關鍵字領取教學。",
};

const MENU_STEPS = [
  { src: "/images/line-guide/menu-01.webp", label: "01．新選單功能總覽" },
  { src: "/images/line-guide/menu-02.webp", label: "02．天天都能用的功能" },
  { src: "/images/line-guide/menu-03.webp", label: "03．預約與作品都在這裡" },
  { src: "/images/line-guide/menu-04.webp", label: "04．最後別忘了這些功能" },
];

const KEYWORD_STEPS = [
  { src: "/images/line-guide/keyword-01.webp", label: "01．怎麼領取大眾占卜／心理測驗" },
  { src: "/images/line-guide/keyword-02.webp", label: "02．怎麼找到大眾占卜／心理測驗" },
  { src: "/images/line-guide/keyword-03.webp", label: "03．怎麼輸入關鍵字" },
  { src: "/images/line-guide/keyword-04.webp", label: "04．收到回覆後，怎麼看內容" },
];

export default function LineGuidePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-10 pt-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-[2rem] bg-night-light/15 px-6 py-7">
            <div className="animate-float-slow absolute right-4 top-4 h-24 w-24 sm:right-8 sm:h-32 sm:w-32">
              <Image src={asset("/images/contact-line-friend-cutout.webp")} alt="小艾拿著手機開心使用 LINE" fill className="object-contain drop-shadow-[0_0_18px_rgba(244,216,146,0.3)]" sizes="128px" />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-3 w-3 text-gold-light" />
              <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">LINE GUIDE</p>
            </div>
            <h1 className="pr-24 font-serif text-3xl font-bold text-paper sm:pr-32 sm:text-4xl">如何使用官方 LINE</h1>
            <p className="mt-3 text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">
              加入官方 LINE 後，跟著這份教學，就能看選單功能、領取大眾占卜與心理測驗。
            </p>
            <a
              href={LINKS.lineOA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-night-dark transition hover:bg-gold-light"
            >
              加入官方 LINE：@153yhemn →
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-night-dark px-4 pb-10 pt-6 sm:px-6">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-gold-light">新選單功能教學．左右滑動瀏覽</p>
          <LineGuideCarousel steps={MENU_STEPS} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-night-dark px-4 pb-20 pt-4 sm:px-6">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-gold-light">大眾占卜／心理測驗 關鍵字領取教學．左右滑動瀏覽</p>
          <LineGuideCarousel steps={KEYWORD_STEPS} />

          <p className="mt-6 text-center text-xs leading-6 text-paper/50">
            看不懂也沒關係，跟著步驟做一次就會囉！
            <br />
            官方 LINE ID：@153yhemn
          </p>
        </div>
      </section>
    </div>
  );
}
