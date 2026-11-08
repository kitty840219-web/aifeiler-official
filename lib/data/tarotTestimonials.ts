export const TAROT_TESTIMONIAL_PHOTOS: string[] = Array.from(
  { length: 31 },
  (_, i) => `/images/tarot-testimonials/review-${String(i + 1).padStart(2, "0")}.webp`
);
