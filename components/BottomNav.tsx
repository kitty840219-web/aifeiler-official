"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { asset } from "@/lib/basePath";
import { playTwinkleSound } from "@/lib/sound";

const TABS = [
  { href: "/about", label: "關於作者", avatar: "/images/nav/nav-about.webp", badge: "bg-gold/20" },
  { href: "/story", label: "品牌故事", avatar: "/images/nav/nav-story.webp", badge: "bg-lavender/20" },
  { href: "/works", label: "最新文章", avatar: "/images/nav/nav-works.webp", badge: "bg-rose-300/20" },
  { href: "/horoscope", label: "星座運勢", avatar: "/images/nav/nav-horoscope.webp", badge: "bg-sky-300/20" },
  { href: "/tarot", label: "塔羅占卜", avatar: "/images/nav/nav-tarot.webp", badge: "bg-violet-300/20" },
  { href: "/shop", label: "商店", avatar: "/images/nav/nav-shop.webp", badge: "bg-emerald-300/20" },
  { href: "/contact", label: "洽談合作", avatar: "/images/nav/nav-contact.webp", badge: "bg-amber-300/20" },
];

const SPARKLES = [
  { top: "-6px", left: "-4px", size: "text-xs", delay: "0s" },
  { top: "-10px", left: "20px", size: "text-[10px]", delay: "0.08s" },
  { top: "2px", left: "26px", size: "text-xs", delay: "0.16s" },
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [justTapped, setJustTapped] = useState<string | null>(null);

  if (searchParams.get("embed") === "1") return null;

  function handleTap(href: string) {
    playTwinkleSound();
    setJustTapped(href);
    window.setTimeout(() => setJustTapped((current) => (current === href ? null : current)), 700);
  }

  return (
    <nav
      aria-label="主要導覽"
      className="site-bottom-nav bg-stars fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-paper/10 bg-night-dark/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.4)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {TABS.map((tab) => {
          const active = tab.href === "/about" ? pathname === "/" || pathname.startsWith("/about") : pathname.startsWith(tab.href);
          const tapped = justTapped === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              onClick={() => handleTap(tab.href)}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[9px] font-medium"
            >
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${tab.badge} ${
                  active ? "scale-110 shadow-[0_0_14px_4px_rgba(236,206,143,0.55)]" : "opacity-60"
                } ${tapped ? "animate-glow-pulse" : ""}`}
              >
                <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                  <Image src={asset(tab.avatar)} alt="" fill sizes="32px" className="object-cover" />
                </span>
                {tapped &&
                  SPARKLES.map((s, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className={`animate-sparkle-pop pointer-events-none absolute ${s.size} text-gold-light`}
                      style={{ top: s.top, left: s.left, animationDelay: s.delay }}
                    >
                      ✨
                    </span>
                  ))}
              </span>
              <span className={active ? "text-gold-light" : "text-paper/60"}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavInner />
    </Suspense>
  );
}
