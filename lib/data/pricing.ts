export const CHIPS = [
  { t: "專業品質", d: "插畫、剪輯、設計皆手工把關，提升品牌形象" },
  { t: "快速交件", d: "一般件 5–10 個工作天" },
  { t: "溝通到位", d: "需求確認，客製化調整" },
  { t: "價格透明", d: "公版報價公開，售後保障" },
];

export const ILLUSTRATION_CARDS = [
  {
    head: "語錄插畫圖卡設計",
    note: "單張構圖＋上色＋字體排版，適合社群貼文與周邊素材",
    rows: [
      { label: "語錄插畫圖卡（單張）", price: "NT$1,500", suffix: "起" },
      { label: "系列圖卡（5 張組）", price: "NT$6,500", suffix: "起" },
      { label: "品牌 IP 角色設計", price: "NT$8,000", suffix: "起" },
    ],
  },
  {
    head: "客製周邊與貼圖",
    note: "明信片／貼紙／飾品／LINE 貼圖企劃與繪製",
    rows: [
      { label: "客製周邊設計", sub: "明信片／貼紙／飾品，單款計價", price: "NT$1,000", suffix: "起／款" },
      { label: "LINE 貼圖設計", sub: "基礎組 16 張，含角色發想", price: "NT$12,000", suffix: "起" },
      { label: "命理／靈性主題視覺設計", price: "NT$6,000", suffix: "起" },
    ],
  },
];

export const VIDEO_CARDS = [
  {
    head: "基礎短影音方案",
    note: "適合 Reels／TikTok／Shorts，含基礎轉場與字幕，素材由客戶提供",
    rows: [
      { label: "15 秒內短影音", price: "NT$800", suffix: "起" },
      { label: "30 秒內短影音", price: "NT$1,200", suffix: "起" },
      { label: "60 秒內短影音", price: "NT$1,800", suffix: "起" },
      { label: "90 秒內短影音", price: "NT$2,500", suffix: "起" },
    ],
  },
  {
    head: "商業剪輯方案",
    note: "含節奏企劃／字幕／音效／轉場設計",
    rows: [
      { label: "3 分鐘內影片", price: "NT$4,000", suffix: "起" },
      { label: "5 分鐘內影片", price: "NT$7,000", suffix: "起" },
      { label: "10 分鐘內影片", price: "NT$12,000", suffix: "起" },
      { label: "10 分鐘以上／企劃型影片", price: "另行報價" },
    ],
  },
];

export const VIDEO_ADDONS = [
  { t: "急件處理（24 小時內給初稿）", p: "NT$1,200" },
  { t: "英文字幕（依影片長度）", p: "NT$1,800 起" },
  { t: "特效字幕／動畫", p: "NT$800 起" },
  { t: "調色／音效設計", p: "NT$800 起" },
  { t: "YouTube 封面設計", p: "NT$1,200／張" },
  { t: "口白／逐字稿剪輯", p: "另行報價" },
];

export const VIDEO_PLANS = [
  {
    title: "基礎方案",
    desc: "簡易剪輯，素材客戶提供",
    rows: [
      { label: "10 支／月", price: "NT$12,000" },
      { label: "20 支／月", price: "NT$22,000" },
      { label: "30 支／月", price: "NT$30,000" },
    ],
  },
  {
    title: "進階方案",
    desc: "含字幕／特效／節奏設計",
    rows: [
      { label: "10 支／月", price: "NT$18,000" },
      { label: "20 支／月", price: "NT$34,000" },
      { label: "30 支／月", price: "NT$48,000" },
    ],
  },
  {
    title: "品牌經營方案",
    desc: "剪輯＋封面＋社群圖＋風格統一",
    rows: [
      { label: "基礎品牌包", sub: "剪輯＋社群圖", price: "NT$30,000", suffix: "／月" },
      { label: "完整品牌包", sub: "剪輯＋設計＋策略建議", price: "NT$48,000", suffix: "／月" },
    ],
  },
];

export const DESIGN_ROWS = [
  { label: "社群貼文設計", sub: "3 張以上每張 NT$1,000", price: "NT$1,200", suffix: "／張" },
  { label: "商品圖設計", price: "NT$1,200", suffix: "／張" },
  { label: "菜單／價目表設計", price: "NT$4,000", suffix: "起" },
  { label: "海報設計", price: "NT$4,000", suffix: "起" },
  { label: "名片設計", sub: "雙面 +NT$500", price: "NT$3,500", suffix: "起" },
  { label: "YouTube 封面設計", price: "NT$1,200", suffix: "／張" },
  { label: "LOGO 設計", price: "NT$6,000", suffix: "起" },
  { label: "AI 商用圖片生成", price: "NT$300", suffix: "／張起" },
];

export const AI_CARDS = [
  {
    head: "1　AI 分鏡設計",
    note: "腳本／分鏡／構圖設計",
    rows: [
      { label: "分鏡腳本設計", price: "NT$1,200", suffix: "／組" },
      { label: "AI 圖片生成", price: "NT$350", suffix: "／張" },
    ],
  },
  {
    head: "2　AI 動畫生成",
    note: "圖片動態化／影片生成",
    rows: [
      { label: "AI 動態生成", price: "依複雜度與長度報價" },
      { label: "1 分鐘 AI 動畫", sub: "約 12–15 個分鏡／分鐘", price: "NT$13,000–19,000" },
    ],
  },
  {
    head: "3　剪輯後製",
    note: "剪輯／字幕／轉場／音效",
    rows: [
      { label: "1 分鐘內剪輯", price: "NT$1,200", suffix: "起" },
      { label: "字幕／轉場／音效", price: "+NT$800", suffix: "起" },
      { label: "配音／調色", price: "另行報價" },
    ],
  },
];

export const STEPS = [
  {
    n: "01",
    t: "加入 LINE 聯繫",
    d: "告訴我們內容需求、風格參考或影片長度。",
  },
  {
    n: "02",
    t: "確認需求與報價",
    d: "依規格與交期提供正式報價單，確認無誤後排入製作排程。",
  },
  {
    n: "03",
    t: "全額付清，開始製作",
    d: "確認報價無誤後一次付清款項，正式開工。",
  },
];

export const TERMS = [
  { k: "交件時間", v: "一般件 5–10 個工作天；急件 3 個工作天內（+NT$1,200）" },
  { k: "修改次數", v: "初稿確認後免費修改 2 次；超出範圍或整份重做另行報價" },
  { k: "付款方式", v: "報價確認後全額付清，款項確認即排入製作排程；長期合作方案可另議" },
  { k: "合約保障", v: "報價確認後可簽署合作確認單，交付項目與權益載明清楚" },
];
