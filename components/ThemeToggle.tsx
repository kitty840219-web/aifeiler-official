"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import { playTwinkleSound } from "@/lib/sound";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    queueMicrotask(() => {
      setTheme(stored);
      setMounted(true);
    });
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    playTwinkleSound();
  }

  if (!mounted) {
    return <span className="flex h-9 w-9 items-center justify-center rounded-l-full" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "切換成暗色系" : "切換成亮色系"}
      className="flex h-9 w-9 items-center justify-center rounded-l-full transition hover:bg-night-light"
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.55 1.55M17.55 17.55l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.55-1.55M17.55 6.45l1.55-1.55"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M20 14.2A8.3 8.3 0 1110.3 4a6.6 6.6 0 009.7 10.2z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
