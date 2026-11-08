"use client";

import { asset } from "@/lib/basePath";

export default function ReplayIntroButton() {
  function replay() {
    sessionStorage.removeItem("aifeiler-entered");
    window.location.href = asset("/");
  }

  return (
    <button
      type="button"
      onClick={replay}
      className="text-xs text-paper/50 underline decoration-dotted underline-offset-4 hover:text-gold-light"
    >
      重新觀看開場畫面
    </button>
  );
}
