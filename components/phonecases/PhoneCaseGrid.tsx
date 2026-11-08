"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/basePath";
import type { PhoneCase } from "@/lib/data/phoneCases";

export default function PhoneCaseGrid({ cases, shopHref }: { cases: PhoneCase[]; shopHref: string }) {
  const [selected, setSelected] = useState<PhoneCase | null>(null);

  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {cases.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setSelected(c)}
            className="group overflow-hidden rounded-2xl border border-gold/20 bg-night-light/20 text-left shadow-card transition hover:border-gold/40"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-night-light/10">
              <Image
                src={asset(c.image)}
                alt={c.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(min-width: 640px) 200px, 50vw"
              />
            </div>
            <div className="px-3 py-3">
              <p className="font-serif text-sm font-bold text-paper">{c.title}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-paper/60">{c.tagline}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative h-full max-h-[85svh] w-full max-w-[430px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="關閉手機殼詳情"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-xl font-bold text-night-dark shadow-soft transition hover:bg-gold-light"
            >
              ✕
            </button>
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-[1.5rem] border border-gold/30 bg-night-dark p-6 text-paper shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl bg-night-light/20">
                <Image src={asset(selected.image)} alt={selected.title} fill className="object-cover" sizes="380px" />
              </div>
              <div className="py-6 text-center">
                <h2 className="font-serif text-xl font-bold">{selected.title}</h2>
                <p className="mt-4 text-left text-sm leading-7 text-paper/75">{selected.tagline}</p>
                <p className="mt-2 text-left text-xs leading-relaxed text-paper/50">
                  透明防撞殼．TPU軟款．四角氣囊防摔保護．輕薄貼合機身．耐磨抗刮日常安心用
                </p>
              </div>
              <a
                href={shopHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto shrink-0 rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-night-dark transition hover:bg-gold-light"
              >
                前往商店選購 →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
