export type TarotPackage = {
  key: string;
  title: string;
  questions: string[];
};

export const TAROT_PACKAGES: TarotPackage[] = [
  {
    key: "reconcile",
    title: "復合套餐",
    questions: ["目前對方對我的想法", "目前對方對複合的想法", "分開後真正的問題點", "未來三個月複合機率", "如何提升複合可能性"],
  },
  {
    key: "relationship",
    title: "交往套餐",
    questions: ["目前關係能量高低", "未來三個月感情運勢", "對方對你的看法", "對方對這段關係的想法", "目前阻礙和關鍵點"],
  },
  {
    key: "ambiguous",
    title: "曖昧套餐",
    questions: ["目前對方對我的感覺", "他有沒有喜歡我", "未來是否有機會交往", "目前關係卡住的原因", "如何拉近彼此距離"],
  },
  {
    key: "single",
    title: "脫單套餐",
    questions: ["目前無法脫單的原因", "近期桃花運勢", "下一段對象特徵", "未來三個月脫單機率", "如何提升戀愛能量"],
  },
  {
    key: "breakup",
    title: "分手斷聯套餐",
    questions: ["我們分手／斷聯的原因", "對方目前的想法與感受", "他會主動聯繫我嗎", "未來三個月有複合機會嗎", "我該怎麼做能增加機會"],
  },
  {
    key: "family",
    title: "家庭關係套餐",
    questions: ["目前家庭關係狀態", "與家人間的課題", "未來三個月變化", "需要注意的溝通問題", "如何改善家庭關係"],
  },
  {
    key: "career",
    title: "工作套餐",
    questions: ["目前工作的三個月運勢", "這份工作適合我嗎", "主管對我的想法", "職場上需注意的人際關係", "如何提升工作運勢"],
  },
  {
    key: "money",
    title: "金錢財運套餐",
    questions: ["目前財運能量狀態", "未來三個月財運趨勢", "主要財源與機會", "容易漏財的原因", "如何提升財運"],
  },
  {
    key: "study",
    title: "學業考試套餐",
    questions: ["目前學習狀態", "考試運勢如何", "容易卡關的地方", "近期讀書效率", "如何提升考運"],
  },
  {
    key: "growth",
    title: "自我成長套餐",
    questions: ["目前內在狀態解析", "我的優勢與天賦", "需要突破的限制", "未來三個月成長方向", "如何提升整體能量"],
  },
];

export const SERVICE_NOTES = [
  "預約後 48 小時內回覆（依單量調整）",
  "文字解析為主，忙碌時會依序回覆",
  "若需急件 +$300，會盡快為您處理",
  "內容皆為指引，最終決定權在你手上",
];

export const PAYMENT_METHODS = {
  domestic: "銀行轉帳、街口、蝦皮支付",
  overseas: "PayPal（限台灣以外）",
};
