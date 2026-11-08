"use client";

import { useMemo, useState } from "react";
import type { Quote } from "@/lib/data/quotes";
import QuoteCard from "@/components/QuoteCard";

export default function QuoteGallery({ quotes }: { quotes: Quote[] }) {
  const tags = useMemo(() => ["全部", ...Array.from(new Set(quotes.map((q) => q.tag)))], [quotes]);
  const [active, setActive] = useState("全部");

  const filtered = active === "全部" ? quotes : quotes.filter((q) => q.tag === active);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isActive = tag === active;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActive(tag)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? "border-gold bg-gold text-night-dark"
                    : "border-paper/20 bg-paper/10 text-paper/70 hover:border-gold/50 hover:text-paper"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-paper/10 px-3.5 py-1.5 text-xs font-semibold text-paper shadow-card">
          收藏語錄 {filtered.length} / {quotes.length}
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((q) => {
          const originalIndex = quotes.findIndex((item) => item.id === q.id);
          return <QuoteCard key={q.id} quote={q} index={originalIndex} />;
        })}
      </div>
    </div>
  );
}
