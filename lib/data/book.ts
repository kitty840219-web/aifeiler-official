const SOURCE_TOTAL = 152;
const REMOVED_SOURCE_PAGES = new Set([3, 4, 5, 6, 7, 8, 9]);

export const BOOK_PAGES = Array.from({ length: SOURCE_TOTAL }, (_, index) => index + 1).filter(
  (page) => !REMOVED_SOURCE_PAGES.has(page)
);
export const BOOK_TOTAL_PAGES = BOOK_PAGES.length;

export function bookImage(displayPage: number) {
  const sourcePage = BOOK_PAGES[displayPage - 1];
  return `/images/aifeiler-book/book-${String(sourcePage).padStart(3, "0")}.webp`;
}
