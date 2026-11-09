import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://kitty840219-web.github.io/aifeiler-official";
const paths = [
  "",
  "/story",
  "/portfolio",
  "/works",
  "/shop",
  "/pricing",
  "/contact",
  "/videos",
  "/phone-cases",
  "/daily-quote",
  "/learn",
  "/learn/spelling",
  "/learn/characters",
  "/learn/idioms",
  "/learn/sentences",
  "/learn/dialogue",
  "/learn/reading",
  "/games",
  "/games/memory",
  "/games/stars",
  "/games/garden",
  "/games/snake",
  "/games/baseball",
  "/games/cricket",
  "/games/breakout",
  "/games/maze",
  "/games/gnomes",
  "/games/pony",
  "/games/popcorn",
  "/games/petanque",
  "/games/platform",
  "/games/island",
  "/games/halloween",
  "/games/mines",
  "/games/tic-tac-toe",
  "/games/tiles",
  "/games/half-moon",
  "/games/pani-puri",
  "/games/ocean-memory",
  "/games/solitaire",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${baseUrl}${path}/`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
