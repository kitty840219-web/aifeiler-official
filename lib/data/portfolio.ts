export type PortfolioSection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  pages: number[];
};

export const PORTFOLIO_SECTIONS: PortfolioSection[] = [
  {
    id: "profile",
    eyebrow: "PROFILE",
    title: "關於我與品牌經營",
    summary: "從個人專長、創作理念到艾飛樂品牌與合作成果，快速認識我的工作方式。",
    pages: [3, 4, 5, 6, 7, 8],
  },
  {
    id: "social",
    eyebrow: "SOCIAL MEDIA",
    title: "社群經營與成效",
    summary: "Facebook、Instagram 與官方 LINE 的內容規劃、數據成效與讀者回饋。",
    pages: [9, 10, 11, 12],
  },
  {
    id: "video-ip",
    eyebrow: "VIDEO & AI IP",
    title: "影音製作與 AI IP 企劃",
    summary: "影片剪輯、動畫製作，以及從人物設定到社群內容的 AI 真人 IP 專案。",
    pages: [14, 15, 16, 17],
  },
  {
    id: "design",
    eyebrow: "VISUAL DESIGN",
    title: "平面、電商與商品設計",
    summary: "涵蓋行銷文宣、DM、Banner、LINE 貼圖、似顏繪、禮品與電商商品視覺。",
    pages: Array.from({ length: 18 }, (_, index) => index + 19),
  },
  {
    id: "immersive",
    eyebrow: "IMMERSIVE & 3D",
    title: "AR／VR 策展與 3D 建模",
    summary: "運用新媒體工具完成線上策展、AR 互動闖關與角色公仔建模。",
    pages: [37, 38, 39, 40],
  },
];

export function portfolioImage(page: number) {
  return `/images/portfolio/portfolio-${String(page).padStart(2, "0")}.webp`;
}
