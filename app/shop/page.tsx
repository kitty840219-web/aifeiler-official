import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Star from "@/components/Star";
import SectionHeading from "@/components/SectionHeading";
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

      <section id="collaboration" className="relative overflow-hidden bg-night-dark px-4 py-16 sm:px-6 sm:py-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading eyebrow="CONTACT" title="洽談合作" desc="插畫委託、品牌合作與客製周邊，歡迎與我聯繫" center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ["專業品質", "插畫、剪輯、設計皆手工把關，提升品牌形象", "/images/contact-quality-cutout.webp"],
              ["快速交件", "一般件 5–10 個工作天", "/images/contact-fast-delivery-cutout.webp"],
              ["溝通到位", "確認用途、風格與細節後再開始製作", "/images/contact-communication-cutout.webp"],
              ["價格透明", "依需求提供清楚報價，安心規劃預算", "/images/contact-transparent-price-cutout.webp"],
            ].map(([title, desc, art]) => (
              <div key={title} className="rounded-[1.75rem] bg-night-light/25 p-6 text-center shadow-card sm:p-8">
                <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
                  <Image src={asset(art)} alt="" fill className="object-contain" sizes="96px" />
                </div>
                <h2 className="mt-3 font-serif text-xl font-bold text-paper">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-paper/70">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex justify-center">
            <Link href="/contact" className="rounded-full bg-gold px-7 py-3 text-sm font-bold text-night-dark transition hover:bg-gold-light">前往聯絡我們 →</Link>
          </div>
        </div>
      </section>
    </div>
    </VisualLayoutEditor>
  );
}
