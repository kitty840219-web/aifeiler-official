"use client";

import FlipBookReader from "./FlipBookReader";
import { PORTFOLIO_VIEW_URL } from "@/lib/data/portfolio";

const pages = Array.from({ length: 79 }, (_, index) => `/images/portfolio-current/page-${String(index + 1).padStart(3, "0")}.webp`);

export default function CanvaPortfolioReader() {
  return <FlipBookReader title="李宛容 Ivy・作品集電子書" pages={pages} landscape originalUrl={PORTFOLIO_VIEW_URL} />;
}
