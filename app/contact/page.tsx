import type { Metadata } from "next";
import Image from "next/image";
import PricingPreviewButton from "@/components/PricingPreviewButton";
import SectionHeading from "@/components/SectionHeading";
import ServiceCarousel from "@/components/ServiceCarousel";
import Star from "@/components/Star";
import { LINKS, SERVICES, SITE } from "@/lib/data/site";
import { CHIPS } from "@/lib/data/pricing";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `合作聯絡 ｜ ${SITE.brand}`,
  description: "與艾飛樂洽談插畫委託、品牌合作與客製周邊。",
};

const CONTACTS = [
  {
    key: "line",
    label: "OFFICIAL LINE",
    title: "加入小艾的好友",
    value: "@153yhemn",
    href: LINKS.lineOA,
    cta: "開啟 LINE →",
    art: "/images/contact-line-friend-cutout.webp",
  },
  {
    key: "mail",
    label: "EMAIL",
    title: "電子郵件",
    value: LINKS.email,
    href: `mailto:${LINKS.email}`,
    cta: "寄送 EMAIL →",
    art: "/images/home-quotes-cutout.webp",
  },
  {
    key: "ig1",
    label: "INSTAGRAM · 語錄",
    title: "艾飛樂語錄",
    value: "@aibi_0219",
    href: LINKS.instagramQuotes,
    cta: "開啟 INSTAGRAM →",
    art: "/images/latest-articles-cutout.webp",
  },
  {
    key: "ig2",
    label: "INSTAGRAM · 插畫",
    title: "插畫創作帳號",
    value: "dreamstar_illustration",
    href: LINKS.instagramIllustration,
    cta: "開啟 INSTAGRAM →",
    art: "/images/about-creator-cutout.webp",
  },
  {
    key: "ig3",
    label: "INSTAGRAM · 艾比",
    title: "真人 IP 艾比",
    value: "@imabby_0219",
    href: LINKS.instagramAbby,
    cta: "開啟 INSTAGRAM →",
    art: "/images/contact-abby-portrait.webp",
  },
];

const SERVICE_ART = [
  "/images/home-quotes-cutout.webp",
  "/images/home-story-cutout.webp",
  "/images/home-shop.webp",
  "/images/contact-line-stickers-cutout.webp",
  "/images/home-contact.webp",
  "/images/home-video.webp",
];

const CONTACT_VALUE_ART = [
  "/images/contact-quality-cutout.webp",
  "/images/contact-fast-delivery-cutout.webp",
  "/images/contact-communication-cutout.webp",
  "/images/contact-transparent-price-cutout.webp",
];

const PROCESS = [
  { step: "01", title: "傳送需求", desc: "透過 Email 或 LINE 告訴我您的想法與用途", art: "/images/contact-process-send-cutout.webp" },
  { step: "02", title: "討論規劃", desc: "確認風格、尺寸、交件時間與報價", art: "/images/contact-process-plan-cutout.webp" },
  { step: "03", title: "草稿確認", desc: "提供草稿供您確認方向，可進行一次調整", art: "/images/contact-process-draft-cutout.webp" },
  { step: "04", title: "完稿交付", desc: "完成上色與細節，交付最終檔案", art: "/images/contact-process-delivery-cutout.webp" },
];

export default function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-12 pt-20 text-center">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative mx-auto max-w-5xl">
            <div className="animate-float-slow absolute -right-2 top-0 h-24 w-24 sm:right-2 sm:h-28 sm:w-28 md:right-0 md:-top-12 md:h-56 md:w-56">
              <Image src={asset("/images/contact-collaboration-cutout.webp")} alt="小艾展示合作企劃，邀請洽談合作" fill priority className="object-contain" sizes="(min-width: 768px) 224px, 112px" />
            </div>
            <div className="mb-4 flex items-center justify-center gap-2">
              <Star className="h-3 w-3 text-gold-light" />
              <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">CONTACT</p>
              <Star className="h-3 w-3 text-gold-light" delay="1s" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">洽談合作</h1>
            <p className="mt-3 text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">插畫委託、品牌合作與客製周邊，歡迎與我聯繫</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
            {CHIPS.map((c, index) => (
              <div key={c.t} className="flex min-h-36 flex-col items-center rounded-2xl bg-night-light/25 p-4 text-center shadow-card sm:min-h-40">
                <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                  <Image src={asset(CONTACT_VALUE_ART[index])} alt={`小艾呈現${c.t}`} fill className="object-contain" sizes="64px" />
                </div>
                <p className="mt-2 text-base font-bold leading-snug text-paper sm:text-lg">{c.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-paper/70 sm:text-sm">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Services / resume-style skills */}
      <section className="relative overflow-hidden bg-night-dark pb-10 pt-10">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="SKILLS & SERVICES" title="專業能力與服務項目" center />
          <div className="mt-10">
            <ServiceCarousel services={SERVICES} art={SERVICE_ART} />
          </div>
          <div className="mt-10 flex justify-center">
            <PricingPreviewButton className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light">
              查看服務報價 →
            </PricingPreviewButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <SectionHeading
              eyebrow="LET'S TALK"
              title="期待與你合作"
              desc={`我是 ${SITE.founder}，${SITE.brandFull}的創作者。無論是插畫委託、品牌視覺、客製周邊或聯名合作，都歡迎透過以下方式與我聯絡。`}
              center
            />
          </div>

          <div className="grid gap-4">
            {CONTACTS.map((c) => (
              <a
                key={c.key}
                href={c.href}
                target={c.key === "mail" ? undefined : "_blank"}
                rel={c.key === "mail" ? undefined : "noopener noreferrer"}
                className="group flex min-h-36 flex-col items-center rounded-[1.75rem] bg-night-light/25 p-6 text-center shadow-card transition hover:-translate-y-1 hover:bg-night-light/35"
              >
                <span className="relative h-24 w-24 shrink-0 transition duration-500 group-hover:scale-105 sm:h-28 sm:w-28">
                  <Image src={asset(c.art)} alt="" fill className="object-contain" sizes="112px" />
                </span>
                <span className="mt-3 block text-xs font-semibold tracking-[0.2em] text-gold-light">{c.label}</span>
                <span className="mt-2 block font-serif text-base font-bold text-paper sm:text-lg">{c.title}</span>
                <span className="mt-2 block break-all text-sm text-paper/70">{c.value}</span>
                <span className="mt-5 block text-xs font-semibold text-gold-light sm:text-sm">{c.cta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-night-dark py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading eyebrow="PROCESS" title="合作流程" center />
          <div className="relative mt-12 grid gap-8">
            {PROCESS.map((p) => (
              <div key={p.step} className="relative flex flex-col items-center rounded-2xl bg-night-light/25 p-5 pt-14 text-center shadow-card">
                <div className="absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 sm:h-28 sm:w-28">
                  <Image src={asset(p.art)} alt={`小艾示範${p.title}`} fill className="object-contain" sizes="112px" />
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-serif text-sm font-bold text-night-dark shadow-soft">
                  {p.step}
                </span>
                <h3 className="mt-3 font-serif text-base font-bold text-paper sm:text-lg">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-paper/70 sm:text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
