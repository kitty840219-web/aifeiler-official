import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Star from "@/components/Star";
import StatBadge from "@/components/StatBadge";
import SocialIcon from "@/components/SocialIcon";
import ShortsCarousel from "@/components/ShortsCarousel";
import PortfolioMiniReader from "@/components/PortfolioMiniReader";
import AifeilerBookMiniReader from "@/components/AifeilerBookMiniReader";
import { SERVICES, SITE, TIMELINE } from "@/lib/data/site";
import { QUOTES } from "@/lib/data/quotes";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `關於作者 Ivy ｜ ${SITE.brand}`,
  description: SITE.description,
};

export default function AboutPage() {
  return (
    <div>
      <div className="border-t border-paper/10" />

      <section className="relative overflow-hidden bg-night-dark">
        <div className="bg-stars relative px-5 py-10 text-center">
          <div className="animate-float-slow absolute right-2 top-0 h-32 w-32 sm:right-6 sm:h-40 sm:w-40">
            <Image src={asset("/images/about-story-xiaoai-cutout.webp")} alt="小艾揮手打招呼" fill className="object-contain drop-shadow-[0_0_18px_rgba(244,216,146,0.3)]" sizes="160px" />
          </div>
          <div className="mb-3 flex items-center justify-center gap-2">
            <Star className="h-3 w-3 text-gold-light" />
            <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">ABOUT</p>
            <Star className="h-3 w-3 text-gold-light" delay="1s" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-paper sm:text-4xl">關於艾飛樂</h2>
          <p className="mt-2 text-sm text-paper/80 sm:text-base">{SITE.brandFull}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <StatBadge icon={<Star className="h-3.5 w-3.5" />} label={`${SITE.established} 年成立`} />
            <StatBadge
              icon={<SocialIcon type="shop" className="h-3.5 w-3.5" />}
              label={`${SERVICES.length} 大服務項目`}
            />
            <StatBadge
              icon={
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M4 5.5c2-1 5-1 8 0v13c-3-1-6-1-8 0v-13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M20 5.5c-2-1-5-1-8 0v13c3-1 6-1 8 0v-13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              }
              label={`${QUOTES.length}+ 篇語錄作品`}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-4xl px-5 pb-12 sm:px-8">
          <SectionHeading eyebrow="TIMELINE" title="創作歷程" center />
          <PortfolioMiniReader />
          <div className="relative mt-12 space-y-10 border-l-2 border-dashed border-lavender/40 pl-8 text-left">
            {TIMELINE.map((t, i) => (
              <div key={t.title}>
                <div className="relative">
                  <span className="absolute -left-[38px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold shadow" />
                  <p className="text-xs font-semibold tracking-widest text-gold-light">{t.year}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-paper">{t.title}</h3>
                  <p className="mt-1 text-sm text-paper/60">{t.desc}</p>
                </div>
                {i === 0 && (
                  <div className="relative mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-night-light/25 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-light">PODCAST</p>
                    <h4 className="mt-1 font-serif text-sm font-bold text-paper">宅宅出音podcast採訪</h4>
                    <div className="relative mt-3 aspect-video overflow-hidden rounded-xl bg-black">
                      <iframe
                        title="宅宅出音podcast採訪"
                        src="https://www.youtube.com/embed/RUH_crJE5Es"
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                {i === 1 && (
                  <div className="relative mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-night-light/25 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-light">EXHIBITION</p>
                    <h4 className="mt-1 font-serif text-sm font-bold text-paper">手帳品牌聯名參展</h4>
                    <div className="relative mt-3 aspect-video overflow-hidden rounded-xl">
                      <Image src={asset("/images/about-timeline-2023-fair.webp")} alt="艾飛樂手帳展攤位陳列" fill className="object-cover" sizes="(min-width: 640px) 512px, 100vw" />
                    </div>
                  </div>
                )}
                {i === 2 && (
                  <div className="relative mt-14 rounded-2xl border border-gold/20 bg-night-light/25 p-4 pt-10 text-center">
                    <div className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 overflow-hidden rounded-xl shadow-soft">
                      <Image src={asset("/images/about-creator-cutout.webp")} alt="小艾站在畫架旁創作" fill className="object-cover" sizes="80px" />
                    </div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-light">BRAND CHARACTER</p>
                    <h4 className="mt-1 font-serif text-sm font-bold text-paper">品牌第一個 IP 角色「小艾」</h4>
                    <p className="mt-1 text-xs leading-relaxed text-paper/60">2024 年誕生，戴著草帽、綁著雙辮，靜靜微笑、雙手合十——小艾是艾飛樂的品牌代言角色。</p>
                  </div>
                )}
                {i === 3 && <AifeilerBookMiniReader />}
                {i === 4 && (
                  <div className="relative mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-night-light/25 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-light">SHORTS</p>
                    <h4 className="mt-1 font-serif text-sm font-bold text-paper">真人 AI 短劇精選</h4>
                    <div className="mt-3">
                      <ShortsCarousel videoIds={["iYy-q9ywHaA", "h6KQl1rclN4", "1hFpZvN0NT0", "ONNtQSExMFo", "X2LcFcb97O4"]} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
