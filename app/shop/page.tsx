import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Star from "@/components/Star";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";
import VisualLayoutEditor from "@/components/VisualLayoutEditor";

export const metadata: Metadata = {
  title: `周邊商店 ｜ ${SITE.brand}`,
  description: "艾飛樂周邊商品：客製化商品、LINE 貼圖與更多小物。",
};

export default function ShopPage() {
  return (
    <VisualLayoutEditor>
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-10 pt-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_130px] items-center gap-4 rounded-[2rem] bg-night-light/15 px-6 py-7">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-3 w-3 text-gold-light" />
                <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">SHOP</p>
              </div>
              <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">周邊商店</h1>
              <p className="mt-3 text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">把語錄裡的溫柔，變成隨身攜帶的小物件</p>
            </div>
            <div className="animate-float-slow relative h-44 w-full">
              <Image data-layout-id="shop-hero" data-layout-name="頁首小艾人物" src={asset("/images/shop-hero-cutout.webp")} alt="小艾提著周邊商品禮物籃" fill className="object-contain drop-shadow-[0_0_18px_rgba(244,216,146,0.3)]" sizes="130px" />
            </div>
          </div>
        </div>
      </section>

      {/* Phone cases promo */}
      <section className="relative overflow-hidden bg-night-dark px-4 pb-6 pt-6 sm:px-6">
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/phone-cases"
            className="group relative block aspect-square w-full overflow-hidden rounded-[1.5rem] border border-gold/20 transition hover:border-gold/40"
          >
            <Image
              data-layout-id="phone-case-banner"
              data-layout-name="手機殼宣傳圖"
              src={asset("/images/phone-cases/collection-banner.webp")}
              alt="療癒插畫手機殼系列，9款透明防撞殼新上市"
              fill
              className="object-cover"
              sizes="430px"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night-dark/85 via-transparent to-transparent p-4">
              <span className="flex w-full items-center justify-between">
                <span className="font-serif text-base font-bold text-paper">療癒插畫手機殼系列</span>
                <span className="shrink-0 text-gold-light transition group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* LINE sticker promo */}
      <section className="relative overflow-hidden bg-night-dark px-4 pb-20 pt-6 sm:px-6">
        <div className="relative mx-auto max-w-3xl">
          <a
            href={LINKS.lineSticker}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square w-full overflow-hidden rounded-[1.5rem] border border-gold/20 transition hover:border-gold/40"
          >
            <Image
              data-layout-id="sticker-banner"
              data-layout-name="LINE 貼圖宣傳圖"
              src={asset("/images/shop/line-sticker-banner.webp")}
              alt="相愛相殺日常 LINE 貼圖新上市"
              fill
              className="object-cover"
              sizes="430px"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night-dark/85 via-transparent to-transparent p-4">
              <span className="flex w-full items-center justify-between">
                <span className="font-serif text-base font-bold text-paper">相愛相殺日常 LINE 貼圖</span>
                <span className="shrink-0 text-gold-light transition group-hover:translate-x-1">→</span>
              </span>
            </div>
          </a>
        </div>
      </section>
    </div>
    </VisualLayoutEditor>
  );
}
