"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/basePath";
import { LINKS } from "@/lib/data/site";
import { PAYMENT_METHODS, SERVICE_NOTES, TAROT_PACKAGES, type TarotPackage } from "@/lib/data/tarotServices";

const SERVICE_OVERVIEW_IMAGE = "/images/tarot-services/service-overview.webp";

export default function TarotServiceMenu() {
  const [selected, setSelected] = useState<TarotPackage | null>(null);
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    if (!selected && !showOverview) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selected, showOverview]);

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 text-paper">
      <div className="rounded-[2rem] bg-paper/[0.04] px-5 py-6 text-left">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gold-light/70">TAROT SERVICES</p>
        <h2 className="mt-2 text-2xl font-bold tracking-wide">付費真人占卜服務</h2>
        <p className="mt-2 text-xs leading-6 text-gold-light/70">
          一次占卜．5 個問題．指引方向．看見答案．療癒內在
        </p>
      </div>

      {/* Service overview (single service / VIP plans / notes / payment) */}
      <section className="mt-6">
        <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-light/70">單次服務．VIP 包月方案</h3>
        <button
          type="button"
          onClick={() => setShowOverview(true)}
          className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-gold-light/20 bg-paper/[0.03] transition hover:border-gold-light/50"
        >
          <Image src={asset(SERVICE_OVERVIEW_IMAGE)} alt="艾飛樂塔羅占卜服務項目與價格" fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night-dark/85 via-transparent to-transparent p-4">
            <p className="text-sm font-semibold text-paper">點一下放大查看完整服務內容 →</p>
          </div>
        </button>
      </section>

      {/* Topic packages */}
      <section className="mt-8">
        <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-light/70">占卜套餐（各 $1000／5 個問題）</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {TAROT_PACKAGES.map((pkg) => (
            <button
              key={pkg.key}
              type="button"
              onClick={() => setSelected(pkg)}
              className="rounded-xl border border-gold-light/20 bg-paper/[0.03] px-3 py-4 text-left text-sm font-semibold text-paper transition hover:border-gold-light/50"
            >
              {pkg.title}
              <span className="mt-1 block text-[10px] font-normal text-gold-light/50">點一下看 5 個問題 →</span>
            </button>
          ))}
        </div>
      </section>

      {/* Service notes */}
      <section className="mt-8 rounded-xl border border-gold-light/20 bg-paper/[0.03] p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-light/70">服務說明</h3>
        <ul className="space-y-1.5">
          {SERVICE_NOTES.map((n) => (
            <li key={n} className="flex items-start gap-2 text-xs leading-5 text-paper/80">
              <span className="mt-0.5 text-gold">・</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Payment */}
      <section className="mt-6 rounded-xl border border-gold-light/20 bg-paper/[0.03] p-4">
        <h3 className="mb-2 text-xs font-semibold tracking-[0.2em] text-gold-light/70">付款方式</h3>
        <p className="text-xs leading-6 text-paper/80">國內支付：{PAYMENT_METHODS.domestic}</p>
        <p className="text-xs leading-6 text-paper/80">海外支付：{PAYMENT_METHODS.overseas}</p>
      </section>

      {/* Booking CTA */}
      <a
        href={LINKS.lineOA}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 block rounded-full bg-gold-light py-3.5 text-center text-sm font-semibold text-[#0b0f2e] shadow-soft transition hover:bg-paper"
      >
        加官方 LINE 預約占卜 →
      </a>
      <p className="mt-4 text-center text-xs leading-6 text-gold-light/60">
        希望每一次占卜，都能成為照亮你心中的光。
        <br />
        每一次抽牌，都是宇宙給你的訊息，讓塔羅陪你一起前行。
      </p>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="關閉套餐詳情"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold-light text-xl font-bold text-[#0b0f2e] shadow-soft transition hover:bg-paper"
            >
              ✕
            </button>
            <div className="rounded-[1.5rem] border border-gold-light/30 bg-night-dark p-6 text-paper shadow-soft">
              <h4 className="font-serif text-lg font-bold text-paper">{selected.title}</h4>
              <p className="mt-1 text-sm font-bold text-gold-light">$1000 ／ 5 個問題</p>
              <ol className="mt-4 space-y-2.5">
                {selected.questions.map((q, i) => (
                  <li key={q} className="flex items-start gap-2.5 text-sm leading-6 text-paper/90">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-light/15 text-[11px] font-semibold text-gold-light">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
              <a
                href={LINKS.lineOA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-full bg-gold-light py-3 text-center text-sm font-semibold text-[#0b0f2e] transition hover:bg-paper"
              >
                加官方 LINE 預約 →
              </a>
            </div>
          </div>
        </div>
      )}

      {showOverview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8"
          onClick={() => setShowOverview(false)}
        >
          <div className="relative h-full max-h-[85svh] w-full max-w-[430px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowOverview(false)}
              aria-label="關閉服務內容"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold-light text-xl font-bold text-[#0b0f2e] shadow-soft transition hover:bg-paper"
            >
              ✕
            </button>
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-[1.5rem] border border-gold-light/30 bg-night-dark p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative min-h-[70vh] w-full flex-1">
                <Image src={asset(SERVICE_OVERVIEW_IMAGE)} alt="艾飛樂塔羅占卜服務項目與價格" fill className="object-contain" sizes="400px" />
              </div>
              <a
                href={LINKS.lineOA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 shrink-0 rounded-full bg-gold-light py-3 text-center text-sm font-semibold text-[#0b0f2e] transition hover:bg-paper"
              >
                加官方 LINE 預約 →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
