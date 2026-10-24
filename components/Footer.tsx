"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SITE } from "@/lib/data/site";
import ReplayIntroButton from "@/components/ReplayIntroButton";

function FooterInner() {
  const searchParams = useSearchParams();
  if (searchParams.get("embed") === "1") return null;

  return (
    <footer className="relative overflow-hidden bg-night-dark text-paper/90">
      <div className="bg-stars pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-paper/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.brandFull}
          </p>
          <p>用插畫與文字，陪你走過每個黑夜。</p>
        </div>
        <div className="mt-4 text-center">
          <ReplayIntroButton />
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense fallback={null}>
      <FooterInner />
    </Suspense>
  );
}
