export type ZodiacElement = "火" | "土" | "風" | "水";

export type ZodiacSign = {
  id: string;
  name: string;
  dateRange: string;
  symbol: string;
  element: ZodiacElement;
  ruler: string;
  traits: string[];
  house: string;
  luckyColor: string;
  luckyNumber: number;
  feature: string;
  image?: string;
};

export const ELEMENT_ICON: Record<ZodiacElement, string> = {
  火: "🔥",
  土: "⛰️",
  風: "🌬️",
  水: "💧",
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: "aries", name: "牡羊座", dateRange: "3/21 - 4/19", symbol: "♈", element: "火", ruler: "火星", house: "第一宮", luckyColor: "紅色", luckyNumber: 9, feature: "勇敢直接，喜歡主動開創新局。", traits: ["衝勁", "直率", "行動派"], image: "/images/zodiac/牡羊座.webp" },
  { id: "taurus", name: "金牛座", dateRange: "4/20 - 5/20", symbol: "♉", element: "土", ruler: "金星", house: "第二宮", luckyColor: "綠色", luckyNumber: 6, feature: "穩健務實，重視安全感與生活品質。", traits: ["穩定", "務實", "重感官"], image: "/images/zodiac/金牛座.webp" },
  { id: "gemini", name: "雙子座", dateRange: "5/21 - 6/20", symbol: "♊", element: "風", ruler: "水星", house: "第三宮", luckyColor: "黃色", luckyNumber: 5, feature: "好奇靈活，擅長交流與吸收新資訊。", traits: ["靈活", "好奇", "善溝通"], image: "/images/zodiac/雙子座.webp" },
  { id: "cancer", name: "巨蟹座", dateRange: "6/21 - 7/22", symbol: "♋", element: "水", ruler: "月亮", house: "第四宮", luckyColor: "銀白色", luckyNumber: 2, feature: "情感細膩，重視家庭、照顧與歸屬感。", traits: ["念舊", "體貼", "重家庭"], image: "/images/zodiac/巨蟹座.webp" },
  { id: "leo", name: "獅子座", dateRange: "7/23 - 8/22", symbol: "♌", element: "火", ruler: "太陽", house: "第五宮", luckyColor: "金色", luckyNumber: 1, feature: "熱情大方，渴望創造、表現與真心肯定。", traits: ["自信", "熱情", "重榮譽"], image: "/images/zodiac/獅子座.webp" },
  { id: "virgo", name: "處女座", dateRange: "8/23 - 9/22", symbol: "♍", element: "土", ruler: "水星", house: "第六宮", luckyColor: "米色", luckyNumber: 4, feature: "觀察細緻，重視秩序、效率與實際改善。", traits: ["細心", "分析", "追求完美"], image: "/images/zodiac/處女座.webp" },
  { id: "libra", name: "天秤座", dateRange: "9/23 - 10/22", symbol: "♎", element: "風", ruler: "金星", house: "第七宮", luckyColor: "粉藍色", luckyNumber: 6, feature: "追求公平和諧，擅長協調關係與欣賞美感。", traits: ["優雅", "重平衡", "善協調"], image: "/images/zodiac/天秤座.webp" },
  { id: "scorpio", name: "天蠍座", dateRange: "10/23 - 11/21", symbol: "♏", element: "水", ruler: "冥王星", house: "第八宮", luckyColor: "深紫色", luckyNumber: 8, feature: "情感深刻，洞察敏銳，投入後極具意志力。", traits: ["深邃", "專注", "重承諾"], image: "/images/zodiac/天蠍座.webp" },
  { id: "sagittarius", name: "射手座", dateRange: "11/22 - 12/21", symbol: "♐", element: "火", ruler: "木星", house: "第九宮", luckyColor: "紫色", luckyNumber: 3, feature: "自由樂觀，喜歡探索世界與追尋更大意義。", traits: ["樂觀", "自由", "愛冒險"], image: "/images/zodiac/射手座.webp" },
  { id: "capricorn", name: "摩羯座", dateRange: "12/22 - 1/19", symbol: "♑", element: "土", ruler: "土星", house: "第十宮", luckyColor: "咖啡色", luckyNumber: 8, feature: "自律有耐心，願意為長期目標穩定累積。", traits: ["自律", "堅毅", "有目標"], image: "/images/zodiac/摩羯座.webp" },
  { id: "aquarius", name: "水瓶座", dateRange: "1/20 - 2/18", symbol: "♒", element: "風", ruler: "天王星", house: "第十一宮", luckyColor: "電光藍", luckyNumber: 7, feature: "獨立創新，關心群體，也重視思想與自由。", traits: ["獨立", "創新", "重理念"], image: "/images/zodiac/水瓶座.webp" },
  { id: "pisces", name: "雙魚座", dateRange: "2/19 - 3/20", symbol: "♓", element: "水", ruler: "海王星", house: "第十二宮", luckyColor: "海藍色", luckyNumber: 5, feature: "浪漫敏銳，富有想像力與同理心。", traits: ["浪漫", "敏感", "富同理心"], image: "/images/zodiac/雙魚座.webp" },
];
