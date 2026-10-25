import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://kitty840219-web.github.io/aifeiler-official";
const paths = [
  "",
  "/about",
  "/portfolio",
  "/works",
  "/shop",
  "/pricing",
  "/contact",
  "/videos",
  "/phone-cases",
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
