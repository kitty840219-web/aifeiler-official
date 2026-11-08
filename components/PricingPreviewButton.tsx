"use client";

import { useEffect, useState, type ReactNode } from "react";
import { asset } from "@/lib/basePath";

export default function PricingPreviewButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative h-full max-h-[85svh] w-full max-w-[430px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="關閉服務報價視窗"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-xl font-bold text-night-dark shadow-soft transition hover:bg-gold-light"
            >
              ✕
            </button>
            <div className="h-full w-full overflow-hidden rounded-[1.5rem] border border-gold/30 bg-night-dark shadow-soft">
              <iframe
                title="服務報價"
                src={`${asset("/pricing/")}?embed=1`}
                className="h-full w-full border-0 bg-night-dark"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
