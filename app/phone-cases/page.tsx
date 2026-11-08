import type { Metadata } from "next";
import PhoneCaseGrid from "@/components/phonecases/PhoneCaseGrid";
import Star from "@/components/Star";
import TagChip from "@/components/TagChip";
import { LINKS, SITE } from "@/lib/data/site";
import { PHONE_CASES } from "@/lib/data/phoneCases";

export const metadata: Metadata = {
  title: `手機殼系列 ｜ ${SITE.brand}`,
  description: "艾飛樂療癒插畫手機殼系列：透明防撞殼、TPU軟款，把溫柔的插畫日常帶著走。",
};

const FEATURES = [
  "高透 TPU 軟殼，保留手機原本質感",
  "四角氣囊防摔設計，日常使用更安心",
  "柔軟好握，輕薄不厚重",
  "療癒插畫印刷，細節溫柔耐看",
];

export default function PhoneCasesPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-10 pt-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-night-light/15 px-6 py-7">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Star className="h-3 w-3 text-gold-light" />
              <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">PHONE CASES</p>
              <TagChip tone="gold">AF480 預購款</TagChip>
            </div>
            <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">艾飛樂手機殼新上市 2026 🌙🌿</h1>
            <p className="mt-3 text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">
              把一句溫柔的話、一幅療癒的插畫，放進每天都會拿在手上的日常裡。這次推出 {PHONE_CASES.length} 款艾飛樂療癒插畫手機殼：星夜、森林、月光、花束、玫瑰、留白幾何，每一款都有不同的情緒與陪伴感。它不只是手機殼，也是一張隨身帶著的小小鼓勵卡。願你在平凡日常裡，也能好好喜歡自己、慢慢前進、看見小小光亮。
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs leading-relaxed text-paper/75">
                  <span className="mt-0.5 text-gold-light">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-paper/50">適合送禮、自用、情緒陪伴與日常穿搭搭配。</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-night-dark px-4 pb-20 pt-6 sm:px-6">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <PhoneCaseGrid cases={PHONE_CASES} shopHref={LINKS.kusdom} />
          <p className="mt-6 text-center text-xs text-paper/50">點一下卡片查看款式詳情 →</p>
        </div>
      </section>
    </div>
  );
}
