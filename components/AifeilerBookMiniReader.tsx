"use client";

import FlipBookReader from "./FlipBookReader";
import { BOOK_TOTAL_PAGES, bookImage } from "@/lib/data/book";

const pages = Array.from({ length: BOOK_TOTAL_PAGES }, (_, index) => bookImage(index + 1));

export default function AifeilerBookMiniReader() {
  return <FlipBookReader title="《遺落在風中的信》" pages={pages} />;
}
