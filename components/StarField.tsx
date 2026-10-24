"use client";

type Star = { top: string; left: string; size: number; delay: string; duration: string };

const STARS: Star[] = [
  { top: "4%", left: "12%", size: 2, delay: "0s", duration: "3.2s" },
  { top: "8%", left: "42%", size: 5, delay: "0.6s", duration: "4s" },
  { top: "6%", left: "78%", size: 2, delay: "1.4s", duration: "2.8s" },
  { top: "16%", left: "88%", size: 3, delay: "2.1s", duration: "3.6s" },
  { top: "13%", left: "58%", size: 2, delay: "0.3s", duration: "3s" },
  { top: "22%", left: "6%", size: 4, delay: "1.8s", duration: "3.8s" },
  { top: "20%", left: "30%", size: 2, delay: "2.6s", duration: "2.6s" },
  { top: "27%", left: "68%", size: 3, delay: "0.9s", duration: "3.4s" },
  { top: "34%", left: "18%", size: 2, delay: "1.2s", duration: "3s" },
  { top: "31%", left: "48%", size: 6, delay: "2.4s", duration: "4.4s" },
  { top: "38%", left: "85%", size: 2, delay: "0.4s", duration: "2.9s" },
  { top: "45%", left: "10%", size: 3, delay: "1.6s", duration: "3.5s" },
  { top: "43%", left: "36%", size: 2, delay: "2.9s", duration: "3.1s" },
  { top: "49%", left: "62%", size: 4, delay: "0.7s", duration: "3.9s" },
  { top: "52%", left: "90%", size: 2, delay: "1.9s", duration: "2.7s" },
  { top: "58%", left: "24%", size: 2, delay: "0.2s", duration: "3.3s" },
  { top: "61%", left: "52%", size: 3, delay: "2.3s", duration: "3.7s" },
  { top: "56%", left: "78%", size: 2, delay: "1.1s", duration: "2.9s" },
  { top: "67%", left: "14%", size: 5, delay: "1.5s", duration: "4.1s" },
  { top: "70%", left: "44%", size: 2, delay: "2.7s", duration: "3s" },
  { top: "65%", left: "70%", size: 2, delay: "0.5s", duration: "3.4s" },
  { top: "76%", left: "88%", size: 3, delay: "1.3s", duration: "3.6s" },
  { top: "80%", left: "20%", size: 2, delay: "2.5s", duration: "2.8s" },
  { top: "84%", left: "58%", size: 4, delay: "0.8s", duration: "4s" },
  { top: "88%", left: "34%", size: 2, delay: "1.7s", duration: "3.2s" },
  { top: "92%", left: "76%", size: 2, delay: "2.2s", duration: "3s" },
];

export default function StarField() {
  return (
    <div
      aria-hidden="true"
      className="night-only-decor pointer-events-none fixed left-1/2 top-0 z-20 h-full w-full max-w-[430px] -translate-x-1/2 overflow-hidden"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-white/40"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: `0 0 ${s.size * 2}px ${s.size * 0.7}px rgba(255,255,255,0.25)`,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
