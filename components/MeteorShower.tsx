"use client";

type Variant = "25" | "35" | "48";
type Meteor = { top: string; left: string; length: number; variant: Variant; delay: string; duration: string };

/* Real meteor showers appear to radiate from one point in the sky, so
   trails show up at different positions with slightly different angles
   rather than as identical parallel lines. Kept mostly in the upper band
   (before hero headings typically start) and spread across the full
   width so they read as scattered across the sky, not stacked in one spot. */
const METEORS: Meteor[] = [
  { top: "1%", left: "6%", length: 55, variant: "35", delay: "0s", duration: "7s" },
  { top: "4%", left: "28%", length: 60, variant: "25", delay: "2.6s", duration: "8s" },
  { top: "2%", left: "52%", length: 45, variant: "48", delay: "5.1s", duration: "7.5s" },
  { top: "6%", left: "76%", length: 55, variant: "35", delay: "1.4s", duration: "8.5s" },
  { top: "11%", left: "14%", length: 45, variant: "48", delay: "4.2s", duration: "7.8s" },
  { top: "13%", left: "89%", length: 60, variant: "25", delay: "6.4s", duration: "7.2s" },
  { top: "17%", left: "42%", length: 50, variant: "35", delay: "3.3s", duration: "8.2s" },
];

export default function MeteorShower() {
  return (
    <div
      aria-hidden="true"
      className="night-only-decor pointer-events-none fixed left-1/2 top-0 z-20 h-full w-full max-w-[430px] -translate-x-1/2 overflow-hidden"
    >
      {METEORS.map((m, i) => (
        <span
          key={i}
          className={`animate-meteor-${m.variant} absolute h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-white/70`}
          style={{
            top: m.top,
            left: m.left,
            width: `${m.length}px`,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  );
}
