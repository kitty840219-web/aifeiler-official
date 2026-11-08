"use client";

import { useEffect, useState } from "react";
import { VIEW_MODE_STORAGE_KEY, type ViewMode } from "@/lib/viewMode";

export default function ViewModeToggle() {
  const [mode, setMode] = useState<ViewMode>("mobile");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMode(document.documentElement.dataset.viewMode === "desktop" ? "desktop" : "mobile");
    });
    const followDevice = () => {
      if (sessionStorage.getItem(VIEW_MODE_STORAGE_KEY)) return;
      const nextMode: ViewMode = window.innerWidth >= 768 ? "desktop" : "mobile";
      document.documentElement.dataset.viewMode = nextMode;
      setMode(nextMode);
    };
    window.addEventListener("resize", followDevice);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", followDevice);
    };
  }, []);

  function selectMode(nextMode: ViewMode) {
    document.documentElement.dataset.viewMode = nextMode;
    sessionStorage.setItem(VIEW_MODE_STORAGE_KEY, nextMode);
    setMode(nextMode);
    window.scrollTo({ left: 0 });
  }

  return (
    <button
      type="button"
      onClick={() => selectMode(mode === "mobile" ? "desktop" : "mobile")}
      aria-label={`目前為${mode === "mobile" ? "手機版" : "網頁版"}，點擊切換成${mode === "mobile" ? "網頁版" : "手機版"}`}
      title={mode === "mobile" ? "切換成網頁版" : "切換成手機版"}
      className="flex h-9 w-9 items-center justify-center rounded-full text-gold-light transition hover:bg-gold/15"
    >
      {mode === "mobile" ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 18.5h4" strokeLinecap="round"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M9 21h6M12 17v4" strokeLinecap="round"/></svg>
      )}
    </button>
  );
}
