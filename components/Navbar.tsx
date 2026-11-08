"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { NAV, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";
import { playTwinkleSound } from "@/lib/sound";
import BackgroundMusic from "@/components/BackgroundMusic";
import ThemeToggle from "@/components/ThemeToggle";
import ViewModeToggle from "@/components/ViewModeToggle";

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  if (searchParams.get("embed") === "1") return null;

  return (
    <header className="sticky top-0 z-30 border-b border-paper/10 bg-night-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-gold-light bg-night-light shadow-card">
            <Image
              src={asset("/images/nav/nav-about.webp")}
              alt={SITE.brand}
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-bold text-paper">艾飛樂 {SITE.brandEn}</span>
            <span className="block text-xs text-paper/60">數位文創工作室</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center rounded-full border border-gold/30 bg-night text-gold-light shadow-soft">
            <ViewModeToggle />
            <span className="h-5 w-px bg-gold/20" aria-hidden />
            <ThemeToggle />
            <span className="h-5 w-px bg-gold/20" aria-hidden />
            <BackgroundMusic />
          </div>
          <button
            aria-label="開啟選單"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-paper"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-paper/10 bg-night-dark px-4 py-3">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                playTwinkleSound();
                setOpen(false);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === link.href ? "bg-gold text-night-dark" : "text-paper/80 hover:bg-paper/10 active:bg-gold/20 active:text-gold-light"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}
