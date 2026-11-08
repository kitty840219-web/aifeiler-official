export type QuoteItem = {
  id: string;
  label: string;
  sub?: string;
  unit: string;
  price: number;
  estimate?: boolean;
  customQuote?: boolean;
  rangeNote?: string;
  maxQty?: number;
  tiers?: { minQty: number; price: number }[];
};

export type QuoteGroup = {
  head: string;
  note?: string;
  items: QuoteItem[];
};

export type QuoteCategory = {
  id: string;
  label: string;
  eyebrow: string;
  desc: string;
  groups: QuoteGroup[];
};

export const QUOTE_CATEGORIES: QuoteCategory[] = [
  {
    id: "illustration",
    label: "插畫語錄",
    eyebrow: "01",
    desc: "語錄圖卡、IP 角色、周邊與貼圖設計",
    groups: [
      {
        head: "語錄插畫圖卡設計",
        items: [
          { id: "quote-card", label: "語錄插畫圖卡（單張）", unit: "張", price: 1500, estimate: true, maxQty: 30 },
          { id: "quote-set", label: "系列圖卡（5 張組）", unit: "組", price: 6500, estimate: true, maxQty: 5 },
          { id: "ip-character", label: "品牌 IP 角色設計", unit: "案", price: 8000, estimate: true, maxQty: 3 },
        ],
      },
      {
        head: "客製周邊與貼圖",
        items: [
          { id: "merch", label: "客製周邊設計", sub: "明信片／貼紙／飾品，單款計價", unit: "款", price: 1000, estimate: true, maxQty: 10 },
          { id: "line-stickers", label: "LINE 貼圖設計", sub: "基礎組 16 張，含角色發想", unit: "組", price: 12000, estimate: true, maxQty: 3 },
          { id: "spiritual-visual", label: "命理／靈性主題視覺設計", unit: "案", price: 6000, estimate: true, maxQty: 3 },
        ],
      },
    ],
  },
  {
    id: "video",
    label: "剪輯服務",
    eyebrow: "02",
    desc: "短影音、商業剪輯與加購服務",
    groups: [
      {
        head: "基礎短影音方案",
        note: "素材由客戶提供",
        items: [
          { id: "video-15s", label: "15 秒內短影音", unit: "支", price: 800, estimate: true, maxQty: 20 },
          { id: "video-30s", label: "30 秒內短影音", unit: "支", price: 1200, estimate: true, maxQty: 20 },
          { id: "video-60s", label: "60 秒內短影音", unit: "支", price: 1800, estimate: true, maxQty: 20 },
          { id: "video-90s", label: "90 秒內短影音", unit: "支", price: 2500, estimate: true, maxQty: 20 },
        ],
      },
      {
        head: "商業剪輯方案",
        items: [
          { id: "video-3min", label: "3 分鐘內影片", unit: "支", price: 4000, estimate: true, maxQty: 10 },
          { id: "video-5min", label: "5 分鐘內影片", unit: "支", price: 7000, estimate: true, maxQty: 10 },
          { id: "video-10min", label: "10 分鐘內影片", unit: "支", price: 12000, estimate: true, maxQty: 10 },
          { id: "video-long", label: "10 分鐘以上／企劃型影片", unit: "支", price: 0, customQuote: true, maxQty: 5 },
        ],
      },
      {
        head: "加購服務",
        note: "可單項加購",
        items: [
          { id: "addon-rush", label: "急件處理（24 小時內給初稿）", unit: "次", price: 1200, maxQty: 1 },
          { id: "addon-subtitle-en", label: "英文字幕", sub: "依影片長度", unit: "支", price: 1800, estimate: true, maxQty: 10 },
          { id: "addon-fx-caption", label: "特效字幕／動畫", unit: "支", price: 800, estimate: true, maxQty: 10 },
          { id: "addon-color-sfx", label: "調色／音效設計", unit: "支", price: 800, estimate: true, maxQty: 10 },
          { id: "addon-thumbnail", label: "YouTube 封面設計", unit: "張", price: 1200, maxQty: 10 },
          { id: "addon-voiceover", label: "口白／逐字稿剪輯", unit: "支", price: 0, customQuote: true, maxQty: 5 },
        ],
      },
    ],
  },
  {
    id: "design",
    label: "平面設計",
    eyebrow: "03",
    desc: "社群圖像、印刷物料與品牌視覺",
    groups: [
      {
        head: "設計服務",
        items: [
          {
            id: "design-social",
            label: "社群貼文設計",
            sub: "3 張以上每張 NT$1,000",
            unit: "張",
            price: 1200,
            maxQty: 20,
            tiers: [{ minQty: 3, price: 1000 }],
          },
          { id: "design-product", label: "商品圖設計", unit: "張", price: 1200, maxQty: 30 },
          { id: "design-menu", label: "菜單／價目表設計", unit: "案", price: 4000, estimate: true, maxQty: 5 },
          { id: "design-poster", label: "海報設計", unit: "案", price: 4000, estimate: true, maxQty: 5 },
          { id: "design-card", label: "名片設計", sub: "單面；雙面 +NT$500", unit: "案", price: 3500, estimate: true, maxQty: 5 },
          { id: "design-card-2side", label: "名片雙面加印", sub: "需搭配名片設計", unit: "案", price: 500, maxQty: 5 },
          { id: "design-thumbnail", label: "YouTube 封面設計", unit: "張", price: 1200, maxQty: 10 },
          { id: "design-logo", label: "LOGO 設計", unit: "案", price: 6000, estimate: true, maxQty: 3 },
          { id: "design-ai-image", label: "AI 商用圖片生成", unit: "張", price: 300, estimate: true, maxQty: 50 },
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "AI 短影音",
    eyebrow: "04",
    desc: "分鏡、AI 動畫生成到剪輯後製",
    groups: [
      {
        head: "AI 分鏡設計",
        note: "腳本／分鏡／構圖設計",
        items: [
          { id: "ai-storyboard", label: "分鏡腳本設計", unit: "組", price: 1200, maxQty: 10 },
          { id: "ai-image", label: "AI 圖片生成", unit: "張", price: 350, maxQty: 50 },
        ],
      },
      {
        head: "AI 動畫生成",
        note: "圖片動態化／影片生成",
        items: [
          {
            id: "ai-animation-min",
            label: "AI 動畫生成",
            sub: "約 12–15 個分鏡／分鐘",
            unit: "分鐘",
            price: 16000,
            estimate: true,
            rangeNote: "NT$13,000–19,000／分鐘，此為區間中間值概估",
            maxQty: 10,
          },
        ],
      },
      {
        head: "剪輯後製",
        note: "剪輯／字幕／轉場／音效",
        items: [
          { id: "ai-edit-min", label: "1 分鐘內剪輯", unit: "支", price: 1200, estimate: true, maxQty: 10 },
          { id: "ai-caption-fx", label: "字幕／轉場／音效", unit: "次", price: 800, estimate: true, maxQty: 5 },
          { id: "ai-vo-color", label: "配音／調色", unit: "次", price: 0, customQuote: true, maxQty: 5 },
        ],
      },
    ],
  },
];
