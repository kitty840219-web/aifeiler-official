import type { Metadata } from "next";
import Image from "next/image";
import ContactInquiryForm from "@/components/ContactInquiryForm";
import SectionHeading from "@/components/SectionHeading";
import Star from "@/components/Star";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `聯絡我們 ｜ ${SITE.brand}`,
  description: "聯絡艾飛樂，洽談塔羅占卜、影片剪輯、平面設計、網站架設與客製化商品。",
};

const BUSINESS_DETAILS = [
  { label: "Google 商家", value: "艾飛樂數位文創個人工作室", href: "https://maps.app.goo.gl/aUxsuuSrxwXXYBRF9" },
  { label: "服務區域", value: "全台" },
  { label: "營業時間", value: "周一至周五 09:00–18:00\n例假日或國定假日暫停服務" },
  { label: "官方 LINE", value: "@153yhemn", href: LINKS.lineOA },
];

export default function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-16 pt-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-55" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="animate-float-slow pointer-events-none absolute -right-6 -top-5 h-28 w-28 sm:-right-2 sm:-top-10 sm:h-44 sm:w-44">
              <Image src={asset("/images/contact-collaboration-cutout.webp")} alt="" fill priority className="object-contain" sizes="176px" />
            </div>
            <div className="mb-4 flex items-center justify-center gap-2">
              <Star className="h-3 w-3 text-gold-light" />
              <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">CONTACT US</p>
              <Star className="h-3 w-3 text-gold-light" delay="1s" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">聯絡我們</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-paper/75 sm:text-base">想製作專屬您的客製化商品嗎？告訴我們你的想法，艾飛樂會為你量身打造專屬的客製化服務。</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="AIFEILER STUDIO" title="聯絡資訊" desc="填寫表單後，系統會帶你前往官方 LINE，讓我們更快收到並回覆你的需求。" />
            <div className="mt-7 grid gap-3">
              {BUSINESS_DETAILS.map((detail) => {
                const content = <><span className="block text-xs font-semibold tracking-[0.16em] text-gold-light">{detail.label}</span><span className="mt-2 block whitespace-pre-line text-sm leading-7 text-paper/85">{detail.value}</span></>;
                return detail.href ? (
                  <a key={detail.label} href={detail.href} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-gold/20 bg-night-light/20 p-5 transition hover:-translate-y-0.5 hover:border-gold/55">
                    {content}
                  </a>
                ) : <div key={detail.label} className="rounded-2xl border border-gold/20 bg-night-light/20 p-5">{content}</div>;
              })}
            </div>
            <a href={LINKS.googleReviews} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full border border-gold/50 px-5 py-3 text-sm font-semibold text-gold-light transition hover:bg-gold/10">查看 Google 商家評價 →</a>
          </div>

          <div>
            <SectionHeading eyebrow="SEND YOUR IDEA" title="告訴我們你的需求" desc="標示 * 為必填欄位；需求內容將整理成一則訊息帶入官方 LINE。" />
            <div className="mt-7"><ContactInquiryForm /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
