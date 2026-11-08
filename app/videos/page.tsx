import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import SocialIcon from "@/components/SocialIcon";
import Star from "@/components/Star";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `影音創作 ｜ ${SITE.brand}`,
  description: "艾飛樂 YouTube 頻道與短影音創作。",
};

const VIDEO_TOPICS = [
  { title: "語錄插畫繪製過程", desc: "從草稿到上色，紀錄一張語錄插畫誕生的過程" },
  { title: "命理 × 靈性主題分享", desc: "結合占卜與靈性視角的療癒內容" },
  { title: "周邊商品開箱與製作", desc: "客製化商品從設計到實品的完整紀錄" },
  { title: "品牌幕後故事", desc: "艾飛樂數位文創工作室的日常與創作理念" },
];

export default function VideosPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night-dark pb-12 pt-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_130px] items-center gap-4 rounded-[2rem] bg-night-light/15 px-6 py-7">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-3 w-3 text-gold-light" />
                <p className="text-xs font-semibold tracking-[0.35em] text-gold-light sm:text-sm">VIDEOS</p>
              </div>
              <h1 className="font-serif text-3xl font-bold text-paper sm:text-4xl">影音創作</h1>
              <p className="mt-3 text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">用影像記錄插畫誕生的每個瞬間</p>
            </div>
            <div className="relative h-44 w-full overflow-hidden rounded-2xl shadow-soft">
              <Image src={asset("/images/journey-camera.webp")} alt="小艾拿著攝影機拍攝" fill className="object-cover" sizes="130px" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-night-light to-night shadow-soft">
          <div className="grid items-center gap-8 p-10 sm:grid-cols-[auto_1fr] sm:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-paper/10 text-paper sm:h-24 sm:w-24">
              <SocialIcon type="youtube" className="h-10 w-10" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-2xl font-bold text-paper">艾飛樂 Aifeiler</h2>
              <p className="mt-2 text-sm text-paper/70">
                YouTube 頻道 @aibi_0219，分享插畫創作過程、品牌故事與生活紀錄。
              </p>
              <a
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night-dark shadow-soft transition hover:bg-gold-light"
              >
                前往 YouTube 頻道 →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night-dark py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="TOPICS" title="影片主題方向" center />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VIDEO_TOPICS.map((v) => (
              <div key={v.title} className="rounded-2xl bg-night-light/25 p-6 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-night-dark">
                  <SocialIcon type="youtube" className="h-4 w-4" />
                </div>
                <h3 className="mt-4 font-serif text-sm font-bold text-paper">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-paper/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
