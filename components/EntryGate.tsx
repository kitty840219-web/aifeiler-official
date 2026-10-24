"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";

const slides = [
  { src: "/images/home-slide-01.png", alt: "小艾在雨後車站迎接晨光" },
  { src: "/images/home-slide-02.png", alt: "小艾沿著海岸公路欣賞夕陽" },
  { src: "/images/home-slide-03.png", alt: "小艾漫步在抽象紙藝花園" },
  { src: "/images/home-slide-04.png", alt: "小艾探索童話棋盤花園" },
  { src: "/images/home-slide-05.png", alt: "小艾走過手作拼貼的山間小徑" },
  { src: "/images/home-slide-06.png", alt: "小艾在暖陽圖書館閱讀" },
  { src: "/images/home-slide-07.png", alt: "小艾在海岸花田眺望遠方" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-current stroke-[1.9]">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.55" cy="6.65" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

export default function EntryGate() {
  const pathname = usePathname();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (pathname !== "/") return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <section className="fixed inset-0 z-50 overflow-hidden bg-[#18152f] text-white">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={asset(slide.src)}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-[1600ms] ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[#17142e]/25" aria-hidden />
      <div className="absolute inset-y-0 left-1/2 w-[min(81vw,24rem)] -translate-x-1/2 border-x border-white/25 bg-[#27213b]/45 shadow-[0_0_48px_rgba(12,9,27,0.28)] backdrop-blur-[2px]" aria-hidden />

      <div className="relative mx-auto flex min-h-[100svh] w-[min(81vw,24rem)] flex-col items-center justify-center px-6 text-center sm:px-9">
        <p className="text-xs font-bold tracking-[0.42em] text-[#f2d49f]">{SITE.brandEn.toUpperCase()}</p>
        <h1 className="mt-4 font-serif text-4xl font-black tracking-[0.16em] text-[#fffaf0] drop-shadow-[0_3px_14px_rgba(21,16,36,0.75)] sm:text-5xl">艾飛樂</h1>
        <p className="mt-3 text-sm font-medium tracking-[0.24em] text-white/85">數位文創個人工作室</p>
        <div className="my-7 h-px w-12 bg-[#f1d299]" />
        <p className="font-serif text-lg font-semibold leading-loose text-[#fffaf0] drop-shadow-[0_2px_10px_rgba(21,16,36,0.8)]">
          {SITE.tagline}
          <br />
          {SITE.taglineSub}
        </p>

        <Link
          href="/about"
          className="mt-9 inline-flex min-w-52 items-center justify-center rounded-full bg-[#5d554e]/95 px-7 py-4 text-base font-bold tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(12,9,27,0.32)] transition hover:-translate-y-0.5 hover:bg-[#756a60]"
        >
          瞭解更多
        </Link>

        <nav aria-label="艾飛樂社群連結" className="mt-7 flex items-center gap-4">
          <a
            href="https://www.facebook.com/profile.php?id=100093979488257"
            target="_blank"
            rel="noreferrer"
            aria-label="前往艾飛樂 Facebook"
            className="grid h-12 w-12 place-items-center rounded-full bg-white/85 font-sans text-[1.75rem] font-black leading-none text-[#655c57] shadow-[0_4px_14px_rgba(12,9,27,0.25)] transition hover:-translate-y-1 hover:bg-white"
          >
            f
          </a>
          <a
            href={LINKS.lineOA}
            target="_blank"
            rel="noreferrer"
            aria-label="加入艾飛樂官方 LINE"
            className="grid h-12 w-12 place-items-center rounded-full bg-white/85 font-sans text-[0.62rem] font-black tracking-tight text-[#655c57] shadow-[0_4px_14px_rgba(12,9,27,0.25)] transition hover:-translate-y-1 hover:bg-white"
          >
            LINE
          </a>
          <a
            href={LINKS.instagramQuotes}
            target="_blank"
            rel="noreferrer"
            aria-label="前往艾飛樂 Instagram"
            className="grid h-12 w-12 place-items-center rounded-full bg-white/85 text-[#655c57] shadow-[0_4px_14px_rgba(12,9,27,0.25)] transition hover:-translate-y-1 hover:bg-white"
          >
            <InstagramIcon />
          </a>
        </nav>

        <div className="absolute bottom-9 flex gap-2" aria-label="背景輪播進度">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.src}
              onClick={() => setActiveSlide(index)}
              aria-label={`顯示第 ${index + 1} 張首頁背景`}
              className={`h-1.5 rounded-full transition-all ${
                index === activeSlide ? "w-8 bg-[#f3d69e]" : "w-1.5 bg-white/55 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
