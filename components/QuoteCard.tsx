import type { Quote } from "@/lib/data/quotes";
import Star from "@/components/Star";

const PALETTES = ["from-night-light to-night", "from-lavender-dark to-night"];

export default function QuoteCard({ quote, index = 0 }: { quote: Quote; index?: number }) {
  const palette = PALETTES[index % PALETTES.length];
  return (
    <div
      className={`bg-grain group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br ${palette} p-6 shadow-card transition-transform duration-300 hover:-translate-y-1`}
    >
      <div className="bg-stars pointer-events-none absolute inset-0 opacity-60" />
      <Star className="absolute right-5 top-5 h-3 w-3 text-gold-light" />
      <Star className="absolute left-6 top-10 h-2 w-2 text-paper/70" delay="1s" />
      <div className="relative flex items-center justify-between">
        <span className="w-fit rounded-full bg-paper/10 px-3 py-1 text-[11px] font-medium tracking-wide text-gold-light">
          {quote.tag}
        </span>
        <span className="font-serif text-xs font-semibold tracking-widest text-paper/55">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="relative">
        <p className="font-serif text-lg font-semibold leading-relaxed text-paper sm:text-xl">
          {quote.line}
        </p>
        {quote.sub && <p className="mt-2 text-xs text-paper/60">— {quote.sub}</p>}
      </div>
    </div>
  );
}
