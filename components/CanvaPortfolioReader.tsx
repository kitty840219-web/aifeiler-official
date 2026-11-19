"use client";

import FlipBookReader from "./FlipBookReader";
import { PORTFOLIO_VIEW_URL } from "@/lib/data/portfolio";

import manifest from "@/lib/data/portfolioManifest.json";

const pages = manifest.pages;

export default function CanvaPortfolioReader() {
  return <FlipBookReader title="李宛容 Ivy・作品集電子書" pages={pages} landscape originalUrl={PORTFOLIO_VIEW_URL} />;
}
