import { ZodiacElement, ZodiacSign } from "./signs";

export type FortuneCategory = "love" | "career" | "wealth" | "health";

const CATEGORY_LABEL: Record<FortuneCategory, string> = {
  love: "愛情",
  career: "事業",
  wealth: "財運",
  health: "健康",
};

const CATEGORY_LINES: Record<FortuneCategory, string[]> = {
  love: [
    "單身的人有機會在日常小事中對某人心動，有伴的人適合多說一句體貼的話，感情裡的溫度往往藏在這些細節裡。",
    "感情裡的小摩擦其實是靠近彼此的機會，主動一點會有意外的溫柔回應，別讓沉默拉開了原本靠得很近的距離。",
    "今天的你格外有魅力，氣場自然而然地吸引著身邊的人，不妨對在意的對象展現真實的自己，不必刻意經營形象。",
    "與其猜測對方的心意，不如直接開口，答案往往比想像中簡單，過度解讀反而容易把關係推向不必要的緊張。",
    "重心先放回自己身上，把自己照顧好、活得有餘裕，愛情自然會被這樣的狀態吸引過來，不必刻意追尋。",
    "曖昧中的兩人今天有機會迎來關鍵的一句話，若感覺對了，不妨主動跨出那一步，猶豫太久反而會錯過氣氛。",
    "長期關係裡容易出現「理所當然」的心態，今天適合特別留意，一個小驚喜或一句感謝，就能讓感情重新升溫。",
    "人際互動中你會特別受歡迎，社交場合裡認識新朋友的機會不小，感情運勢也可能因此意外展開新的篇章。",
    "過去的一段感情記憶可能會被勾起，這不是要你回頭，而是提醒你從中看懂自己真正在乎的關係模樣。",
    "溝通品質會直接影響今天的感情氛圍，話說得太快容易被誤會，放慢語速、多一分耐心會讓對方更能感受到你的心意。",
    "單身者今天適合把生活圈打開，參加聚會或嘗試新活動，緣分常常藏在計畫之外的偶遇裡。",
    "伴侶之間今天適合聊一聊未來的規劃，把心裡的想法說出口，會發現彼此其實比想像中更有共識。",
  ],
  career: [
    "手上的專案有機會迎來新進展，堅持原本的方向就對了，過程中若有雜音，先相信自己的判斷再從長計議。",
    "適合主動請教前輩或夥伴，一句話可能就能解開卡關已久的問題，這段時間的貴人運正悄悄靠近。",
    "細節決定成敗，今天特別適合把之前草率完成的部分重新檢查一次，一次仔細的複查能省下之後更大的麻煩。",
    "有新的合作或提案機會出現，勇敢表達自己的想法，你的觀點比你以為的更有說服力，別急著自我懷疑。",
    "工作步調可能有點緊湊，先排出優先順序，一步一步來就不會亂，硬撐著同時處理所有事只會拖慢整體進度。",
    "團隊合作中你會扮演穩定局面的角色，適合居中協調，你的一句公允發言能讓卡住的討論重新推進。",
    "今天適合為長遠的職涯方向做一次盤點，寫下近期的成果與心得，會看見自己其實走得比想像中更遠。",
    "工作上的靈感特別活躍，適合把腦中零散的想法整理成具體提案，趁著這股思路清晰的狀態趕快動筆。",
    "與主管或客戶的溝通今天特別關鍵，準備充分再開口，會讓對方對你的專業留下更深刻的印象。",
    "瑣碎的行政雜務容易在今天堆積，建議先處理最耗時的那一項，剩下的會意外地順手許多。",
    "職場上的競爭氛圍可能稍微升溫，不必因此焦慮，穩住自己的步調、把該做的事做好，成果自然會說話。",
    "今天適合學習新技能或吸收新知，投入的時間會在不久的將來，以意想不到的方式回饋到工作表現上。",
  ],
  wealth: [
    "正財運穩定，投資理財適合保守觀望，不宜衝動出手，這段時間耐心累積比追求短期報酬更划算。",
    "有一筆意外的小收入或優惠正在路上，留意生活周遭的訊息，說不定會有意外的驚喜出現。",
    "花錢前先想一下是需要還是想要，能省下一筆不小的開銷，這個小習慣會讓荷包比想像中寬裕。",
    "適合整理一下荷包與帳目，把近期的收支重新盤點一次，會發現自己的財務狀況比想像中更穩健。",
    "與朋友聚會或人情往來的花費會增加，記得抓好預算，量力而為的社交才不會讓自己壓力太大。",
    "今天適合重新檢視固定支出，像是訂閱服務或會員費，取消用不到的項目會讓每月現金流輕鬆不少。",
    "工作上的努力有機會轉化為實質的財務回饋，獎金或加薪的消息可能就在這幾天出現。",
    "投資理財適合以長線思維操作，短線進出的誘惑今天特別要留意，衝動的決定容易讓自己後悔。",
    "適合為未來的計畫存一筆專款，哪怕金額不大，養成固定儲蓄的習慣會帶來意外的安全感。",
    "借貸往來的事情今天要格外謹慎，白紙黑字寫清楚，能避免日後因為記憶落差產生的誤會。",
    "生活中的小確幸值得花一點預算犒賞自己，適度的享受能讓辛苦工作的自己重新充飽電。",
    "財運上會有貴人相助的跡象，一個建議或一條資訊可能就是接下來財務規劃的重要轉折點。",
  ],
  health: [
    "作息容易日夜顛倒，提醒自己早點放下手機休息，睡眠品質是這段時間身體狀態的關鍵。",
    "腸胃或喉嚨是這幾天要留意的部位，飲食盡量清淡一點，辛辣或生冷的食物先暫時忍一忍。",
    "適合安排一次舒展身體的運動，久坐的痠痛會明顯改善，哪怕只是十分鐘的伸展也有幫助。",
    "情緒起伏比較大，找個信任的人聊聊會輕鬆許多，別把所有壓力都自己一個人扛著。",
    "整體精神狀態不錯，是充電、恢復體力的好時機，趁著這股好狀態安排一些放鬆的行程。",
    "眼睛與肩頸容易感到疲勞，長時間盯著螢幕之後記得起身走動，簡單的按摩也能舒緩不少。",
    "免疫力在這段時間比較敏感，早晚溫差大時記得添件外套，別讓小感冒打亂了原本的節奏。",
    "適合安排一次規律的作息調整，固定時間睡覺與起床，身體很快就能感受到明顯的差異。",
    "心情容易因為小事起伏，適合寫下心裡的感受或找個安靜的空間獨處片刻，讓情緒有個出口。",
    "水分攝取要特別留意，天氣或工作忙碌都容易讓人忘記喝水，隨身帶一瓶水會是不錯的提醒。",
    "適合安排一次久違的健康檢查或身體保養，提前留意小狀況，能省下之後更多的麻煩。",
    "運動後的痠痛感這幾天會比較明顯，記得補充蛋白質與足夠的休息，身體正在默默變得更強壯。",
  ],
};

type ElementFlavor = { opener: string[]; closer: string[] };

const ELEMENT_FLAVOR: Record<ZodiacElement, ElementFlavor> = {
  火: {
    opener: [
      "火象星座今天的行動力特別旺盛，內心那股「想到就做」的衝勁被明顯放大——",
      "屬於你的火元素能量正在升溫，直覺告訴你該往前踏出一步的時候，就別再猶豫——",
      "今天的你像是被點燃了一把小火，熱情與自信同時湧現，很適合主動出擊——",
    ],
    closer: [
      "記得把這股衝勁用在對的地方，speed 固然重要，但留一點空間給耐心會讓結果更漂亮。",
      "衝動之前先深呼吸一次，行動力配上一點思考，今天的成果會更加圓滿。",
      "這股熱度很珍貴，好好把握、也別讓自己燃燒過頭，適時休息才走得長久。",
    ],
  },
  土: {
    opener: [
      "土象星座今天特別能感受到腳踏實地的力量，穩定是你今天最大的資產——",
      "屬於你的土元素能量偏向沉澱與累積，今天適合把手邊的事一件一件做扎實——",
      "今天的你會比平常更有耐心，願意花時間把細節顧好，這份踏實會被看見——",
    ],
    closer: [
      "穩紮穩打從來不會讓你吃虧，今天累積的每一步，都會成為未來的底氣。",
      "偶爾也可以給自己一點彈性，太過謹慎有時反而錯過機會，適度放鬆會更順利。",
      "務實的你今天特別值得信賴，身邊的人會因為你的穩定而感到安心。",
    ],
  },
  風: {
    opener: [
      "風象星座今天的思緒特別活躍，腦中的想法多到來不及一一記錄——",
      "屬於你的風元素能量偏向流動與交流，今天特別適合與人對話、交換想法——",
      "今天的你像一陣輕快的風，靈感與訊息都在你身邊快速流轉——",
    ],
    closer: [
      "想法很多是好事，但記得挑一兩件真正重要的落地執行，才不會流於空想。",
      "多與人交流會帶來意外的收穫，今天遇見的一句話，可能就是關鍵的提醒。",
      "腦袋轉得快的同時，也記得留一點安靜的時間，讓自己好好消化這些訊息。",
    ],
  },
  水: {
    opener: [
      "水象星座今天的感受力特別細膩，很容易察覺到別人沒說出口的心情——",
      "屬於你的水元素能量偏向內在流動，今天的直覺特別準，值得多相信自己一點——",
      "今天的你像一片平靜的湖水，情感豐沛卻也格外容易被外界的漣漪影響——",
    ],
    closer: [
      "細膩是你的天賦，但也記得替自己的情緒留一點喘息的空間，別照單全收。",
      "相信直覺的同時，也給自己一點時間確認，感性與理性並用會更安穩。",
      "今天特別適合靠近讓你感到放鬆的人事物，讓內心的水面重新恢復平靜。",
    ],
  },
};

const LUCKY_COLORS = ["珊瑚粉", "薄荷綠", "鵝黃色", "靛藍色", "米白色", "焦糖棕", "薰衣草紫", "湖水藍", "玫瑰金", "霧霾藍"];

const LUCKY_DIRECTIONS = ["東方", "西方", "南方", "北方", "東北方", "東南方", "西北方", "西南方"];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function todayDisplay(): string {
  const parts = new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", month: "numeric", day: "numeric", weekday: "short" }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  const weekday = value("weekday").replace("週", "");
  return `${value("month")}月${value("day")}日 星期${weekday}`;
}

export type FortuneReport = {
  dateKey: string;
  dateDisplay: string;
  overallScore: number;
  overallOpener: string;
  categories: { key: FortuneCategory; label: string; score: number; text: string }[];
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  luckySign?: string;
  advice?: string;
  source?: "local" | "gemini";
};

const CATEGORY_ORDER: FortuneCategory[] = ["love", "career", "wealth", "health"];

export function generateFortune(sign: ZodiacSign, dateKey: string = todayKey()): FortuneReport {
  const baseSeed = hashString(`${sign.id}-${dateKey}`);
  const flavor = ELEMENT_FLAVOR[sign.element];

  const categories = CATEGORY_ORDER.map((key, i) => {
    const seed = baseSeed + i * 17;
    const score = 3 + (seed % 3); // 3~5 stars, keeps tone gentle and encouraging
    return { key, label: CATEGORY_LABEL[key], score, text: pick(CATEGORY_LINES[key], seed) };
  });

  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  const overallOpener = `${pick(flavor.opener, baseSeed)}\n\n${pick(flavor.closer, baseSeed + 11)}`;

  return {
    dateKey,
    dateDisplay: todayDisplay(),
    overallScore,
    overallOpener,
    categories,
    luckyColor: pick(LUCKY_COLORS, baseSeed + 3),
    luckyNumber: (baseSeed % 9) + 1,
    luckyDirection: pick(LUCKY_DIRECTIONS, baseSeed + 5),
    source: "local",
  };
}
