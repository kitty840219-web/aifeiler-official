import type { Metadata } from "next";
import PortfolioGallery from "@/components/PortfolioGallery";
import AifeilerBookReader from "@/components/AifeilerBookReader";

export const metadata: Metadata = {
  title: "李宛容 Ivy｜數位內容與視覺設計作品集",
  description: "李宛容 Ivy 的個人作品集，收錄品牌經營、社群內容、影音製作、AI IP、平面設計、電商視覺、AR／VR 與 3D 建模作品。",
};

const SKILLS = ["社群內容企劃", "平面與電商設計", "影音剪輯與動畫", "AI IP 人物企劃", "AR／VR 互動", "3D 建模"];

const EXPERIENCE = [
  { period: "2026", role: "數位行銷企劃專案", detail: "數位學習網站與互動遊戲設計、AI 動畫製作、分鏡剪輯、專案預算與教學簡報。" },
  { period: "2025", role: "影片剪輯師／行銷企劃", detail: "負責剪輯、分鏡、拍攝、素材蒐集、簡報製作與專案企劃。" },
  { period: "2024–2025", role: "社群行銷／主管助理", detail: "經營 Facebook、Instagram 與論壇，製作業績報表、報價、合約與行銷提案。" },
  { period: "2022–2023", role: "人資行政會計／社群經營", detail: "管理七間機構社群，執行人資建檔、影音拍攝剪輯、薪資與勞健保作業。" },
  { period: "2014–2022", role: "行政會計／Shipping／副總助理", detail: "累積多年行政、訂單、報關、薪資、轉帳、文件管理及跨地協作經驗。" },
];

const PROJECT_LINKS = [
  { label: "艾飛樂品牌網站", href: "https://kitty840219-web.github.io/aifeiler-official/", note: "品牌、內容與互動功能整合" },
  { label: "Instagram 語錄創作", href: "https://www.instagram.com/aibi_0219/", note: "社群內容與插畫語錄" },
  { label: "YouTube 影音作品", href: "https://www.youtube.com/@aibi_0219", note: "動畫、剪輯與企劃作品" },
  { label: "AI 互動遊戲", href: "https://service-20260706-434892229881.asia-east1.run.app/", note: "AI 協作開發與互動設計" },
  { label: "AR／VR 線上策展", href: "https://www.artsteps.com/view/64d22c63dc9e8265e8f65331", note: "3D 模擬展覽與互動體驗" },
  { label: "LINE 貼圖作品", href: "https://line.me/S/shop/sticker/author/1140025/new?lang=zh-Hant", note: "角色貼圖設計與上架" },
];

export default function PortfolioPage() {
  return (
    <div className="w-full overflow-hidden bg-night-dark">
      <section className="bg-stars relative px-5 pb-4 pt-14 sm:px-8 sm:pb-6 sm:pt-20">
        <div className="mx-auto max-w-6xl text-center">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-gold-light">IVY LEE · PORTFOLIO</p>
            <h1 className="mt-5 text-center font-serif text-4xl font-bold leading-tight text-paper sm:text-6xl">數位內容與視覺設計<br />作品集</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-paper/75 sm:text-xl">把企劃、文字、影像與設計整合成完整的品牌體驗，持續探索 AI、互動媒體與商業視覺的更多可能。</p>
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {SKILLS.map((skill) => <span key={skill} className="rounded-full border border-gold/35 bg-gold/10 px-3 py-2 text-sm font-medium text-gold-light">{skill}</span>)}
            </div>
          </div>
        </div>
      </section>

      <PortfolioGallery />

      <AifeilerBookReader />

      <section className="bg-paper px-5 py-14 text-ink sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-gold-dark">ABOUT IVY</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">跨領域的內容創作者</h2>
              <p className="mt-5 text-base leading-8 text-ink/75 sm:text-lg">擁有國際貿易與數位文創的跨領域背景，以及超過 11 年的行政、專案與內容製作經驗。擅長靈活運用 AI 工具，把企劃轉化成網站、影像、簡報與平面設計成品。</p>
              <div className="mt-7 space-y-4 rounded-2xl bg-[#f3eadc] p-5">
                <div><p className="text-sm font-bold text-gold-dark">學歷</p><p className="mt-1 font-semibold">醒吾科技大學｜國際貿易系</p><p className="text-sm text-ink/60">國立中興大學｜數位人文與文創產業進修</p></div>
                <div><p className="text-sm font-bold text-gold-dark">專業工具</p><p className="mt-1 text-sm leading-7 text-ink/70">ChatGPT、Gemini、Claude、Codex、Midjourney、Photoshop、Illustrator、Premiere、WordPress</p></div>
                <div><p className="text-sm font-bold text-gold-dark">進修方向</p><p className="mt-1 text-sm text-ink/70">iPAS AI 應用規劃師與生成式 AI 應用</p></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-gold-dark">EXPERIENCE</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">工作經歷</h2>
              <div className="mt-7 space-y-4">
                {EXPERIENCE.map((item) => (
                  <div key={`${item.period}-${item.role}`} className="grid gap-2 rounded-2xl border border-ink/10 p-5 sm:grid-cols-[100px_1fr]">
                    <p className="font-serif text-lg font-bold text-gold-dark">{item.period}</p>
                    <div><h3 className="text-lg font-bold">{item.role}</h3><p className="mt-1 text-base leading-7 text-ink/65">{item.detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold tracking-[0.3em] text-gold-light">SELECTED LINKS</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-paper sm:text-4xl">代表作品連結</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-gold/20 bg-night-light/70 p-5 transition hover:-translate-y-1 hover:border-gold/40 hover:bg-night-light">
                <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-bold text-paper">{link.label}</h3><span className="text-xl text-gold-light transition group-hover:translate-x-1">↗</span></div>
                <p className="mt-2 text-base leading-7 text-paper/65">{link.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
