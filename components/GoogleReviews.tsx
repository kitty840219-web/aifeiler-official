"use client";

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/data/site";
import styles from "./GoogleReviews.module.css";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
const placeId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID;

type MapsWindow = Window & {
  google?: { maps: { importLibrary: (name: string) => Promise<unknown> } };
};
let placesLibrary: Promise<unknown> | null = null;

function loadPlaces(key: string) {
  if (placesLibrary) return placesLibrary;
  placesLibrary = new Promise<void>((resolve, reject) => {
    const maps = (window as MapsWindow).google?.maps;
    if (maps?.importLibrary) { resolve(); return; }
    const script = document.createElement("script");
    const params = new URLSearchParams({ key, v: "weekly", libraries: "places", language: "zh-TW" });
    script.src = "https://maps.googleapis.com/maps/api/js?" + params;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); reject(new Error("Google Maps failed to load")); };
    document.head.appendChild(script);
  }).then(async () => {
    const maps = (window as MapsWindow).google?.maps;
    if (!maps) throw new Error("Google Maps unavailable");
    await maps.importLibrary("places");
  }).catch((error: unknown) => {
    placesLibrary = null;
    throw error;
  });
  return placesLibrary;
}

export default function GoogleReviews() {
  const host = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!apiKey || !placeId || !section.current) return;
    let cancelled = false;
    let started = false;
    let details: HTMLElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onLoad = () => { if (!cancelled) { clearTimeout(timer); setStatus("ready"); } };
    const onError = () => { if (!cancelled) { clearTimeout(timer); setStatus("error"); } };
    async function start() {
      if (started) return;
      started = true;
      timer = setTimeout(onError, 25000);
      try {
        await loadPlaces(apiKey!);
        if (cancelled || !host.current) return;
        details = document.createElement("gmp-place-details");
        details.className = styles.widget;
        details.addEventListener("gmp-load", onLoad);
        details.addEventListener("gmp-error", onError);
        const request = document.createElement("gmp-place-details-place-request");
        request.setAttribute("place", placeId!);
        details.append(request);
        for (const name of ["gmp-place-name", "gmp-place-rating", "gmp-place-reviews"]) {
          details.append(document.createElement(name));
        }
        host.current.replaceChildren(details);
      } catch { onError(); }
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void start();
      }
    }, { rootMargin: "200px" });
    observer.observe(section.current);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer.disconnect();
      details?.removeEventListener("gmp-load", onLoad);
      details?.removeEventListener("gmp-error", onError);
      details?.remove();
    };
  }, []);

  // Keep the existing Google review link until the owner has configured access.
  if (!apiKey || !placeId) return null;

  return (
    <section ref={section} className={styles.section} aria-labelledby="google-reviews-title">
      <p className={styles.eyebrow}>VOICES FROM GOOGLE</p>
      <h3 id="google-reviews-title">Google 顧客評論</h3>
      <p className={styles.intro}>在這裡滑動，看看大家的真實分享。</p>
      <div aria-live="polite">
        {status === "loading" && <p className={styles.message}>正在載入 Google 評論…</p>}
        {status === "error" && <p className={styles.message}>評論暫時無法載入，請點下方連結前往 Google 閱讀。</p>}
      </div>
      <div ref={host} className={styles.host} hidden={status === "error"} />
      <a className={styles.link} href={LINKS.googleReviews} target="_blank" rel="noopener noreferrer">在 Google 查看所有評論 ↗</a>
    </section>
  );
}
