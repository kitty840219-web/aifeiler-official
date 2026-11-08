export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Court = "page" | "knight" | "queen" | "king";

export type TarotCard = {
  id: number;
  numeral: string;
  name: string;
  nameEn: string;
  symbol: string;
  upright: { keywords: string[]; meaning: string };
  reversed: { keywords: string[]; meaning: string };
  /** Classical element; set on the 22 major arcana cards. */
  element?: "火" | "水" | "風" | "土";
  /** Present only on the 56 minor arcana cards; major arcana cards omit these. */
  suit?: Suit;
  rank?: number; // 1-10 for pip cards
  court?: Court; // set instead of `rank` for court cards
  /** Illustrated card face; falls back to the generated SVG art when absent. */
  image?: string;
};

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    numeral: "0",
    name: "愚者",
    nameEn: "The Fool",
    symbol: "🌞",
    element: "風",
    upright: { keywords: ["新的開始", "冒險精神", "無限可能"], meaning: "新的開始就在眼前，帶著天真自由與冒險精神，隨性而為也是一種無限可能。" },
    reversed: { keywords: ["魯莽行事", "缺乏準備", "停滯不前"], meaning: "魯莽行事、缺乏準備讓你顯得不負責任，或者只是還沒準備好跨出那一步，正停滯不前。" },
  },
  {
    id: 1,
    numeral: "I",
    name: "魔術師",
    nameEn: "The Magician",
    symbol: "✨",
    element: "火",
    upright: { keywords: ["創造力", "行動力", "資源整合"], meaning: "你已經整合好手邊的資源，創造力與行動力兼具，這是一個良好的開端。" },
    reversed: { keywords: ["欺騙", "才能未發揮", "缺乏溝通"], meaning: "手法拙劣或帶著欺騙的成分，才能尚未發揮，也可能是缺乏溝通、意志力薄弱。" },
  },
  {
    id: 2,
    numeral: "II",
    name: "女祭司",
    nameEn: "The High Priestess",
    symbol: "🌙",
    element: "水",
    upright: { keywords: ["直覺", "潛意識", "靜止等待"], meaning: "答案藏在潛意識與直覺裡，此刻適合靜止等待、沉靜觀察，而非急著行動。" },
    reversed: { keywords: ["情緒化", "忽視直覺", "秘密被揭發"], meaning: "情緒化的反應讓你忽視了直覺，內心的感受被壓抑，也可能有秘密正被揭發。" },
  },
  {
    id: 3,
    numeral: "III",
    name: "皇后",
    nameEn: "The Empress",
    symbol: "🌿",
    element: "土",
    upright: { keywords: ["豐盛", "母愛", "創造力"], meaning: "豐盛與母愛般的滋養正圍繞著你，這是享受舒適、讓創造力自然產出的時刻。" },
    reversed: { keywords: ["過度控制", "缺乏安全感", "情感窒息"], meaning: "過度控制或浪費讓關係失去餘裕，缺乏安全感使情感陷入窒息，產出也因此受阻。" },
  },
  {
    id: 4,
    numeral: "IV",
    name: "皇帝",
    nameEn: "The Emperor",
    symbol: "🏔️",
    element: "火",
    upright: { keywords: ["權威", "結構與秩序", "穩定控制"], meaning: "建立結構與秩序能讓你掌握局面，權威來自理性決策後的穩定控制。" },
    reversed: { keywords: ["濫用權力", "固執暴戾", "動盪不安"], meaning: "濫用權力或固執暴戾，反而讓局面動盪不安，剛愎自用只會失去該有的控制力。" },
  },
  {
    id: 5,
    numeral: "V",
    name: "教皇",
    nameEn: "The Hierophant",
    symbol: "📜",
    element: "土",
    upright: { keywords: ["傳統規範", "精神導師", "學習與教育"], meaning: "尋求傳統規範或精神導師的指引，透過學習與教育、團體認同，會讓這件事更有方向。" },
    reversed: { keywords: ["打破傳統", "叛逆", "過度僵化"], meaning: "打破傳統的叛逆，或是反過來墨守成規、過度僵化，都可能來自不實的指引。" },
  },
  {
    id: 6,
    numeral: "VI",
    name: "戀人",
    nameEn: "The Lovers",
    symbol: "💞",
    element: "風",
    upright: { keywords: ["愛與結合", "重要抉擇", "價值觀契合"], meaning: "愛與結合的夥伴關係，或是一個重要抉擇，都在考驗你內心真正的價值觀是否契合。" },
    reversed: { keywords: ["關係破裂", "抉擇錯誤", "價值觀衝突"], meaning: "價值觀衝突讓關係出現破裂的風險，一個錯誤的抉擇或不合適的結合，也可能只是誘惑。" },
  },
  {
    id: 7,
    numeral: "VII",
    name: "戰車",
    nameEn: "The Chariot",
    symbol: "🐎",
    element: "水",
    upright: { keywords: ["意志力", "勝券在握", "克服衝突"], meaning: "憑意志力和強烈的目標感，你能克服內外的衝突，勝券在握地向前衝刺。" },
    reversed: { keywords: ["失控", "衝動冒進", "方向錯誤"], meaning: "失控與衝動冒進讓方向出現錯誤，被情緒綁架的你，正在原地打轉。" },
  },
  {
    id: 8,
    numeral: "VIII",
    name: "力量",
    nameEn: "Strength",
    symbol: "🦁",
    element: "火",
    upright: { keywords: ["以柔克剛", "內在勇氣", "耐心包容"], meaning: "以柔克剛的內在勇氣，加上耐心與包容，是這份堅韌不拔背後真正的力量。" },
    reversed: { keywords: ["軟弱無力", "失去自信", "被慾望掌控"], meaning: "軟弱無力、失去自信，或是被慾望掌控而急躁衝動，恐懼正在悄悄接管你。" },
  },
  {
    id: 9,
    numeral: "IX",
    name: "隱士",
    nameEn: "The Hermit",
    symbol: "🕯️",
    element: "土",
    upright: { keywords: ["尋求真理", "內省思考", "導師指引"], meaning: "遠離喧囂、尋求真理，這段內省思考的孤獨沉澱，會帶來如導師般的指引。" },
    reversed: { keywords: ["孤立無援", "逃避現實", "忽視忠告"], meaning: "孤立無援的固執，或是藉獨處逃避現實，讓你忽視了旁人的忠告。" },
  },
  {
    id: 10,
    numeral: "X",
    name: "命運之輪",
    nameEn: "Wheel of Fortune",
    symbol: "🎡",
    element: "火",
    upright: { keywords: ["轉機", "命運的安排", "順應趨勢"], meaning: "一個轉機正順應著命運的安排到來，順應趨勢，幸運正隨著週期循環而至。" },
    reversed: { keywords: ["運勢下滑", "抗拒改變", "重複錯誤"], meaning: "運勢下滑、阻礙連連，抗拒改變只會讓你在重複的錯誤裡打轉。" },
  },
  {
    id: 11,
    numeral: "XI",
    name: "正義",
    nameEn: "Justice",
    symbol: "⚖️",
    element: "風",
    upright: { keywords: ["公平公正", "理性衡量", "因果報應"], meaning: "誠實面對事實、理性衡量，公平公正的決定終將以因果報應回饋於你。" },
    reversed: { keywords: ["不公不義", "逃避責任", "雙重標準"], meaning: "不公不義或雙重標準讓局面失衡，逃避責任的帳，終究還沒算清。" },
  },
  {
    id: 12,
    numeral: "XII",
    name: "吊人",
    nameEn: "The Hanged Man",
    symbol: "🌀",
    element: "水",
    upright: { keywords: ["換位思考", "甘願犧牲", "臣服於當下"], meaning: "暫停等待、換位思考，甘願的犧牲換來靈性覺悟，臣服於當下反而看清真相。" },
    reversed: { keywords: ["無謂的犧牲", "死板固執", "毫無進展"], meaning: "無謂的犧牲換來的只是拖延，死板固執的無奈妥協，讓事情毫無進展。" },
  },
  {
    id: 13,
    numeral: "XIII",
    name: "死神",
    nameEn: "Death",
    symbol: "🦋",
    element: "水",
    upright: { keywords: ["結束與重生", "徹底變革", "放手舊事物"], meaning: "一個階段正走向結束與重生，放手舊事物，才能讓徹底變革後的新可能長出來。" },
    reversed: { keywords: ["恐懼改變", "垂死掙扎", "不肯放手"], meaning: "恐懼改變讓你拖泥帶水，垂死掙扎的僵局難解，只因還不肯放手。" },
  },
  {
    id: 14,
    numeral: "XIV",
    name: "節制",
    nameEn: "Temperance",
    symbol: "🌊",
    element: "火",
    upright: { keywords: ["調和平衡", "適度適中", "身心療癒"], meaning: "調和平衡、適度適中的溝通協調，會帶來身心療癒與靈魂的昇華。" },
    reversed: { keywords: ["失衡", "缺乏自制", "極端行為"], meaning: "失衡與缺乏自制讓溝通出現障礙，極端行為使兩端始終無法融合。" },
  },
  {
    id: 15,
    numeral: "XV",
    name: "惡魔",
    nameEn: "The Devil",
    symbol: "⛓️",
    element: "土",
    upright: { keywords: ["物質慾望", "上癮束縛", "感官誘惑"], meaning: "物質慾望與感官誘惑帶來的利益交換，正化為一種上癮般的束縛與執念。" },
    reversed: { keywords: ["擺脫束縛", "覺醒解脫", "恢復自由"], meaning: "覺醒解脫的時刻到了，打破枷鎖、遠離誘惑，你正在擺脫束縛、恢復自由。" },
  },
  {
    id: 16,
    numeral: "XVI",
    name: "高塔",
    nameEn: "The Tower",
    symbol: "⚡",
    element: "火",
    upright: { keywords: ["突如其來的劇變", "信念崩塌", "破除虛妄"], meaning: "突如其來的劇變帶來信念崩塌般的意外衝擊，卻也破除了虛妄，讓真相浮現。" },
    reversed: { keywords: ["危機延後", "苟延殘喘", "隱瞞問題"], meaning: "危機被延後，苟延殘喘地隱瞞問題，只是在迴避一場徹底毀滅的餘波。" },
  },
  {
    id: 17,
    numeral: "XVII",
    name: "星星",
    nameEn: "The Star",
    symbol: "⭐",
    element: "風",
    upright: { keywords: ["希望與信心", "靈感湧現", "平靜療癒"], meaning: "風暴過後，希望與信心正在回來，靈感湧現，帶來平靜療癒與坦誠相見的前景。" },
    reversed: { keywords: ["失望落空", "缺乏信心", "失去方向"], meaning: "失望落空讓你缺乏信心，好高騖遠的絕望，使你暫時失去了方向。" },
  },
  {
    id: 18,
    numeral: "XVIII",
    name: "月亮",
    nameEn: "The Moon",
    symbol: "🌕",
    element: "水",
    upright: { keywords: ["不安與恐懼", "幻象", "隱藏的危機"], meaning: "不安與恐懼交織成幻象，眼前訊息不完整，但直覺正比邏輯更早察覺隱藏的危機。" },
    reversed: { keywords: ["真相大白", "撥雲見日", "誤會冰釋"], meaning: "真相大白，撥雲見日，恐懼逐漸消散，你正走出迷惘、誤會也隨之冰釋。" },
  },
  {
    id: 19,
    numeral: "XIX",
    name: "太陽",
    nameEn: "The Sun",
    symbol: "☀️",
    element: "火",
    upright: { keywords: ["成功與榮耀", "光明磊落", "活力充沛"], meaning: "成功與榮耀就在眼前，光明磊落、活力充沛，允許自己單純地感到快樂喜悅。" },
    reversed: { keywords: ["熱情減退", "暫時延遲", "過度自信"], meaning: "熱情正在減退，好消息暫時延遲，也可能是過度自信讓成就顯得不夠圓滿。" },
  },
  {
    id: 20,
    numeral: "XX",
    name: "審判",
    nameEn: "Judgement",
    symbol: "📯",
    element: "火",
    upright: { keywords: ["召喚與覺醒", "重大決定", "重生"], meaning: "一次召喚與覺醒，過去的經驗正被重新召喚，是時候做出重大決定、洗心革面。" },
    reversed: { keywords: ["自我懷疑", "逃避召喚", "拖延不決"], meaning: "自我懷疑讓你逃避這次召喚，悔恨過去的同時，也拖延著該做的決定。" },
  },
  {
    id: 21,
    numeral: "XXI",
    name: "世界",
    nameEn: "The World",
    symbol: "🌍",
    element: "土",
    upright: { keywords: ["圓滿達成", "階段性終點", "完美整合"], meaning: "一個循環走到圓滿達成的階段性終點，完美整合後的成功，正等著被實現。" },
    reversed: { keywords: ["未完結", "最後一步受阻", "缺乏成就感"], meaning: "還有未完結的事，最後一步受阻，讓這份成果始終缺乏該有的成就感。" },
  },
];

// Illustrated card faces, added incrementally as they're produced; the rest fall back to generated SVG art.
const MAJOR_ARCANA_IMAGES: Record<number, string> = {
  0: "/images/tarot/00-愚者.webp",
  1: "/images/tarot/01-魔術師.webp",
  2: "/images/tarot/02-女祭司.webp",
  3: "/images/tarot/03-皇后.webp",
  4: "/images/tarot/04-皇帝.webp",
  5: "/images/tarot/05-教皇.webp",
  6: "/images/tarot/06-戀人.webp",
  7: "/images/tarot/07-戰車.webp",
  8: "/images/tarot/08-力量.webp",
  9: "/images/tarot/09-隱士.webp",
  10: "/images/tarot/10-命運之輪.webp",
  11: "/images/tarot/11-正義.webp",
  12: "/images/tarot/12-吊人.webp",
  13: "/images/tarot/13-死神.webp",
  14: "/images/tarot/14-節制.webp",
  15: "/images/tarot/15-惡魔.webp",
  16: "/images/tarot/16-高塔.webp",
  17: "/images/tarot/17-星星.webp",
  18: "/images/tarot/18-月亮.webp",
  19: "/images/tarot/19-太陽.webp",
  20: "/images/tarot/20-審判.webp",
  21: "/images/tarot/21-世界.webp",
};
MAJOR_ARCANA.forEach((card) => {
  const image = MAJOR_ARCANA_IMAGES[card.id];
  if (image) card.image = image;
});

// Minor arcana illustrated faces, added incrementally; ids follow the base+offset scheme above.
const MINOR_ARCANA_IMAGES: Record<number, string> = {
  22: "/images/tarot/22-權杖01.webp",
  23: "/images/tarot/23-權杖02.webp",
  24: "/images/tarot/24-權杖03.webp",
  25: "/images/tarot/25-權杖04.webp",
  26: "/images/tarot/26-權杖05.webp",
  27: "/images/tarot/27-權杖06.webp",
  28: "/images/tarot/28-權杖07.webp",
  29: "/images/tarot/29-權杖08.webp",
  30: "/images/tarot/30-權杖09.webp",
  31: "/images/tarot/31-權杖10.webp",
  32: "/images/tarot/32-權杖侍者.webp",
  33: "/images/tarot/33-權杖騎士.webp",
  34: "/images/tarot/34-權杖王后.webp",
  35: "/images/tarot/35-權杖國王.webp",
  36: "/images/tarot/36-聖杯01.webp",
  37: "/images/tarot/37-聖杯02.webp",
  38: "/images/tarot/38-聖杯03.webp",
  39: "/images/tarot/39-聖杯04.webp",
  40: "/images/tarot/40-聖杯05.webp",
  41: "/images/tarot/41-聖杯06.webp",
  42: "/images/tarot/42-聖杯07.webp",
  43: "/images/tarot/43-聖杯08.webp",
  44: "/images/tarot/44-聖杯09.webp",
  45: "/images/tarot/45-聖杯10.webp",
  46: "/images/tarot/46-聖杯侍者.webp",
  47: "/images/tarot/47-聖杯騎士.webp",
  48: "/images/tarot/48-聖杯王后.webp",
  49: "/images/tarot/49-聖杯國王.webp",
  50: "/images/tarot/50-寶劍01.webp",
  51: "/images/tarot/51-寶劍02.webp",
  52: "/images/tarot/52-寶劍03.webp",
  53: "/images/tarot/53-寶劍04.webp",
  54: "/images/tarot/54-寶劍05.webp",
  55: "/images/tarot/55-寶劍06.webp",
  56: "/images/tarot/56-寶劍07.webp",
  57: "/images/tarot/57-寶劍08.webp",
  58: "/images/tarot/58-寶劍09.webp",
  59: "/images/tarot/59-寶劍10.webp",
  60: "/images/tarot/60-寶劍侍者.webp",
  61: "/images/tarot/61-寶劍騎士.webp",
  62: "/images/tarot/62-寶劍王后.webp",
  63: "/images/tarot/63-寶劍國王.webp",
  64: "/images/tarot/64-錢幣01.webp",
  65: "/images/tarot/65-錢幣02.webp",
  66: "/images/tarot/66-錢幣03.webp",
  67: "/images/tarot/67-錢幣04.webp",
  68: "/images/tarot/68-錢幣05.webp",
  69: "/images/tarot/69-錢幣06.webp",
  70: "/images/tarot/70-錢幣07.webp",
  71: "/images/tarot/71-錢幣08.webp",
  72: "/images/tarot/72-錢幣09.webp",
  73: "/images/tarot/73-錢幣10.webp",
  74: "/images/tarot/74-錢幣侍者.webp",
  75: "/images/tarot/75-錢幣騎士.webp",
  76: "/images/tarot/76-錢幣王后.webp",
  77: "/images/tarot/77-錢幣國王.webp",
};

const CHINESE_DIGITS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const RANK_NAMES_EN = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const COURT_META: Record<Court, { label: string; en: string; badge: string }> = {
  page: { label: "侍者", en: "Page", badge: "侍" },
  knight: { label: "騎士", en: "Knight", badge: "騎" },
  queen: { label: "皇后", en: "Queen", badge: "后" },
  king: { label: "國王", en: "King", badge: "王" },
};

type OrientedContent = { keywords: string[]; meaning: string };
type MinorContent = { upright: OrientedContent; reversed: OrientedContent };

const WANDS_PIPS: MinorContent[] = [
  { upright: { keywords: ["原始熱情", "新計劃的起點", "靈感爆發"], meaning: "強烈的熱情與靈感正在爆發，這是新計劃充滿動能的起點。順應當下的衝動，勇敢踏出第一步，不要猶豫。" }, reversed: { keywords: ["熱情消退", "缺乏方向感", "計畫延誤"], meaning: "熱情正在消退，缺乏方向感讓計畫延誤或資源遲遲不到位。重新審視目標，找出讓你失去動力的根本原因。" } },
  { upright: { keywords: ["宏觀規劃", "展望未來", "跨出舒適圈"], meaning: "立足當下、放眼未來，你正在做宏觀的規劃，考慮是否要跨出舒適圈。放大格局，勇敢規劃更大膽的藍圖。" }, reversed: { keywords: ["害怕未知", "固步自封", "缺乏遠見"], meaning: "害怕未知讓你固步自封，缺乏長遠眼光，或做出了錯誤的擴張決定。若還沒準備好，先穩固基底再做決定。" } },
  { upright: { keywords: ["計畫啟動", "進展順利", "遠方合作"], meaning: "計畫已經啟動且進展順利，跨領域或遠方的合作正帶來令人期待的回報。保持耐性，持續保持視野開闊。" }, reversed: { keywords: ["進展受阻", "合作出現問題", "缺乏遠見"], meaning: "進展受阻，合作或供應鏈出現問題，讓遠大的理想暫時落空。重新調整執行細節，確保資訊傳遞順暢。" } },
  { upright: { keywords: ["穩固", "慶祝", "階段性成功"], meaning: "階段性的成功值得慶祝，團隊與家庭關係和諧穩固。好好享受當下的美好成果，與身邊的人分享喜悅。" }, reversed: { keywords: ["團隊不合", "內部衝突", "基底不穩"], meaning: "團隊不合或內部衝突讓基底不夠穩固，慶祝活動也可能因此延期。先處理好內部的矛盾，打好基礎。" } },
  { upright: { keywords: ["競爭", "意見分歧", "混亂"], meaning: "競爭與意見分歧帶來混亂的衝突，需要多方協調。將這種衝突視為良性競爭與磨合，溝通時多聽少說。" }, reversed: { keywords: ["惡性競爭", "逃避問題", "冷戰"], meaning: "衝突加劇轉為惡性競爭，或是問題被掩蓋、逐漸平息卻未真正解決。跳脫無謂的勝負欲，才能化解危機。" } },
  { upright: { keywords: ["勝利", "榮耀", "獲得認可"], meaning: "表現卓越獲得認可，公開的成功為你帶來榮耀與自信。坦然接受你的榮譽與讚賞，保持謙遜但展現魅力。" }, reversed: { keywords: ["期待落空", "失敗", "努力未被看見"], meaning: "期待落空，努力未被看見，甚至可能名譽受損。檢視是否過度依賴他人的掌聲，重拾內心的自信。" } },
  { upright: { keywords: ["堅守陣地", "面對挑戰", "不屈不撓"], meaning: "面對挑戰或質疑，你正堅守陣地、孤軍奮戰。挺直腰桿，不要退縮，你擁有足夠的優勢化解危機。" }, reversed: { keywords: ["不堪重負", "孤立無援", "防線崩潰"], meaning: "不堪重負讓你感到孤立無援，防線正逐漸崩潰。評估這場戰是否值得繼續，適度尋求外部支援。" } },
  { upright: { keywords: ["快速發展", "訊息傳遞", "果斷行動"], meaning: "事情正飛快進展，訊息密集傳遞，行動也變得果斷迅速。抓住當下的時機，順應這股快速推進的能量。" }, reversed: { keywords: ["混亂延誤", "訊息錯誤", "急躁出錯"], meaning: "混亂與延誤讓訊息出現錯誤，急躁衝動可能導致計畫失控。放慢腳步，仔細確認傳達的每一條資訊。" } },
  { upright: { keywords: ["戒備", "最後的防線", "堅持"], meaning: "雖然身心俱疲、曾遭受打擊，你仍警惕地堅守著最後的防線。勝利就在眼前，再咬牙堅持一下。" }, reversed: { keywords: ["筋疲力盡", "防線失守", "極度固執"], meaning: "筋疲力盡讓防線逐漸失守，過度的防禦與固執只會耗盡自己。允許自己休息，試著給予彼此基本信任。" } },
  { upright: { keywords: ["過度負擔", "責任重大", "接近極限"], meaning: "承擔過多的責任與工作量，壓力已經接近極限，仍咬牙硬撐著。學會授權與拒絕，適時釋放負擔。" }, reversed: { keywords: ["崩潰放棄", "學會放下", "分工合作"], meaning: "壓力終於引爆崩潰，或是你終於學會放下負擔、開始分工合作。卸下不屬於你的重擔，勇敢說「不」。" } },
];

const WANDS_COURTS: Record<Court, MinorContent> = {
  page: { upright: { keywords: ["好奇探索", "好消息", "熱情新人"], meaning: "像個充滿好奇心的探索者，帶來好消息，雖然經驗不足但充滿熱情。" }, reversed: { keywords: ["缺乏耐心", "三分鐘熱度", "壞消息"], meaning: "缺乏耐心、三分鐘熱度，也可能帶來延誤或取消的壞消息。" } },
  knight: { upright: { keywords: ["行動力", "野心", "果斷勇敢"], meaning: "充滿行動力與野心，果斷勇敢、熱情奔放，是個充滿魅力的開拓者。" }, reversed: { keywords: ["莽撞行事", "脾氣暴躁", "虎頭蛇尾"], meaning: "莽撞行事，脾氣暴躁，做事容易虎頭蛇尾、缺乏耐性。" } },
  queen: { upright: { keywords: ["熱情自信", "樂觀大方", "獨立魅力"], meaning: "熱情自信、樂觀大方，是個具感染力、獨立自主且充滿魅力的存在。" }, reversed: { keywords: ["佔有欲強", "妒忌心重", "情緒失控"], meaning: "佔有欲強、妒忌心重，情緒容易失控，行事顯得專橫霸道。" } },
  king: { upright: { keywords: ["前瞻領袖", "魄力願景", "決斷力"], meaning: "具前瞻性的領袖特質，充滿魄力與願景，是個事業有成、決斷力十足的領導者。" }, reversed: { keywords: ["獨裁專制", "剛愎自用", "衝動盲目"], meaning: "獨裁專制、剛愎自用，高高在上的態度顯得衝動盲目、缺乏耐心。" } },
};

const CUPS_PIPS: MinorContent[] = [
  { upright: { keywords: ["情感的源頭", "充沛的愛", "靈性連結"], meaning: "情感的源頭湧現充沛的愛，直覺與靈性連結正在萌芽。敞開心扉，讓愛自然流淌。" }, reversed: { keywords: ["情緒低落", "靈感枯竭", "情感封閉"], meaning: "情緒低落、靈感枯竭，內心情感封閉，付出也得不到回應。先學會愛自己，充實內心。" } },
  { upright: { keywords: ["和諧連結", "平等互惠", "心靈契合"], meaning: "和諧且平等互惠的連結，彼此心靈契合、雙向奔赴。珍惜這份相互理解與支持，保持坦誠溝通。" }, reversed: { keywords: ["感情失衡", "溝通不良", "利益衝突"], meaning: "感情失衡，溝通不良帶來誤會與利益衝突。檢視雙方是否保持平等，及時修補溝通裂痕。" } },
  { upright: { keywords: ["歡慶", "社交聚會", "共享喜悅"], meaning: "團隊合作順利完成目標，值得歡慶的社交聚會正共享著喜悅。與朋友或團隊分享你的喜悅，運用群體力量。" }, reversed: { keywords: ["小團體排擠", "過度娛樂", "表面朋友"], meaning: "小團體的排擠或過度娛樂耽誤了正事，也可能只是表面上的朋友。保持適當界線，專注於重要事務。" } },
  { upright: { keywords: ["倦怠", "忽視機會", "情緒停滯"], meaning: "對現狀感到倦怠與無趣，情緒停滯讓你忽視了眼前的新選擇或機會。抬頭看看身邊已經擁有的資源。" }, reversed: { keywords: ["重拾動力", "擺脫停滯", "把握機會"], meaning: "終於重拾動力，擺脫停滯期，主動把握原本錯過的機會。積極擁抱這股醒悟後的新改變。" } },
  { upright: { keywords: ["悲傷", "失落", "懊悔"], meaning: "悲傷與懊悔讓你專注於失去的事物，感到強烈的挫折。允許自己悲傷，但別忘了身後依然留有希望。" }, reversed: { keywords: ["走出低谷", "放下執念", "重新開始"], meaning: "走出低谷，開始放下過去的執念，準備重新評估現狀、重新開始。拭乾眼淚，專注於當前還擁有的資源。" } },
  { upright: { keywords: ["舊人重逢", "溫馨餽贈", "純真安全感"], meaning: "舊人重逢帶來溫馨的餽贈與純真的安全感，也可能受到前輩或貴人的照顧。珍惜身邊給予你純粹關懷的人。" }, reversed: { keywords: ["沉溺過去", "抗拒成長", "過度依賴"], meaning: "過度沉溺於過去的輝煌，抗拒成長，關係也顯得過度依賴或幼稚。告別過去，勇敢面對成年人的責任。" } },
  { upright: { keywords: ["白日夢", "選擇過多", "不切實際"], meaning: "面對過多的選擇與不切實際的幻想，容易想法很多卻缺乏執行力。務實一點，淘汰虛無飄渺的幻想。" }, reversed: { keywords: ["看清現實", "目標明確", "擺脫誘惑"], meaning: "幻象破滅，你正看清現實、目標變得明確，準備擺脫誘惑做出務實選擇。趁著頭腦清醒時迅速採取行動。" } },
  { upright: { keywords: ["轉身離開", "追求更高目標", "尋找真相"], meaning: "為了追求更有意義的道路，你選擇放棄現有的成果、轉身離開。勇敢聽從內心的聲音，放手是成長的開始。" }, reversed: { keywords: ["害怕改變", "缺乏勇氣", "漂泊不定"], meaning: "害怕改變讓你留在不滿意的環境中，缺乏離開的勇氣、漂泊不定。克服對未知的恐懼，不要委屈自己。" } },
  { upright: { keywords: ["願望實現", "滿足", "美夢成真"], meaning: "願望正在實現，物質與情感都獲得極高的滿足感，美夢即將成真。好好享受這份幸福，保持慷慨分享的心。" }, reversed: { keywords: ["表面光鮮", "自我膨脹", "期待落空"], meaning: "表面光鮮，內部卻空虛，過度自我膨脹或貪心不足讓期待落空。檢視內心真正的渴望，別被虛榮蒙蔽。" } },
  { upright: { keywords: ["家庭圓滿", "情感昇華", "幸福美滿"], meaning: "家庭圓滿、情感昇華到極致，長久和諧的幸福美滿正圍繞著你。珍惜並捍衛這份來之不易的溫暖。" }, reversed: { keywords: ["團隊不和", "價值觀衝突", "缺乏歸屬感"], meaning: "團隊或家庭內部缺乏凝聚力，價值觀衝突讓人缺乏歸屬感。主動面對核心矛盾，用心修補情感紐帶。" } },
];

const CUPS_COURTS: Record<Court, MinorContent> = {
  page: { upright: { keywords: ["感性想像", "情感訊息", "浪漫新人"], meaning: "充滿感性與想像力，是傳達情感訊息、直覺敏銳的浪漫新人。" }, reversed: { keywords: ["情緒化", "過度敏感", "逃避現實"], meaning: "情緒化、過度敏感，容易逃避現實，也可能正經歷感情受挫。" } },
  knight: { upright: { keywords: ["浪漫追求", "藝術氣息", "體貼溫柔"], meaning: "浪漫的追求者，帶著藝術氣息與理想主義，體貼溫柔如白馬王子。" }, reversed: { keywords: ["花心不專", "情感勒索", "不切實際"], meaning: "花心不專一，用情不專，也可能是不切實際的空想家。" } },
  queen: { upright: { keywords: ["同理心", "直覺敏銳", "情感滋養"], meaning: "具備強烈同理心與敏銳直覺，溫柔體貼，情感豐富且富有滋養能力。" }, reversed: { keywords: ["情緒失控", "過度依賴", "猜忌心重"], meaning: "情緒容易失控，多愁善感又過度依賴，猜忌心重甚至帶有情感綁架。" } },
  king: { upright: { keywords: ["情緒穩定", "包容", "心靈導師"], meaning: "情緒穩定、極具包容力，如同心靈導師般明智且富有同理心。" }, reversed: { keywords: ["情緒勒索", "冷酷無情", "雙重標準"], meaning: "情緒勒索、冷酷無情，行事帶有雙重標準，甚至濫用感情欺騙他人。" } },
};

const SWORDS_PIPS: MinorContent[] = [
  { upright: { keywords: ["心智突破", "極致理性", "真理顯現"], meaning: "心智迎來突破性的思維，極致的理性切斷了混亂，真理正在顯現。運用理性與客觀分析，果斷砍斷糾纏。" }, reversed: { keywords: ["思維混亂", "決策失誤", "言語傷人"], meaning: "思維混亂導致決策失誤，言語也可能傷人，計畫遭到強烈阻礙。暫緩重大決策，冷靜整理思路。" } },
  { upright: { keywords: ["抗拒真相", "僵局", "內心矛盾"], meaning: "抗拒面對真相讓你陷入僵局，內心矛盾不敢面對現實、逃避抉擇。摘下眼罩，勇敢面對內心恐懼。" }, reversed: { keywords: ["僵局打破", "真相大白", "被迫選擇"], meaning: "僵局終於打破，真相大白，你被迫做出選擇，也可能面臨資訊過載的混亂。坦然接受隨之而來的選擇。" } },
  { upright: { keywords: ["心碎", "背叛", "言語傷害"], meaning: "心碎與背叛帶來深刻的傷痛，言語衝突或三角問題正引發情緒陣痛。接納悲傷，這是療癒的必經過程。" }, reversed: { keywords: ["傷痛過去", "修復關係", "走出陰霾"], meaning: "傷痛正逐漸過去，你開始修復關係、走出一敗塗地的陰霾。放下過去的怨恨，給自己重生的機會。" } },
  { upright: { keywords: ["休息整頓", "退隱沉思", "養精蓄銳"], meaning: "高壓過後需要休息整頓，退隱沉思是為了養精蓄銳，暫停行動並非放棄。充分休息，才能走更遠的路。" }, reversed: { keywords: ["重新投入", "打破休止", "過勞"], meaning: "重新投入戰場、打破休止狀態，也可能是被迫提前復工導致過勞。確認自己是否已經充飽電再出發。" } },
  { upright: { keywords: ["自私的勝利", "雙輸", "自尊心作祟"], meaning: "自尊心作祟下贏得的勝利，換來的卻是雙輸的局面與爭吵衝突。思考這場「勝利」的代價是否過高。" }, reversed: { keywords: ["意識到害處", "尋求和解", "損失擴大"], meaning: "意識到無意義爭鬥的害處後開始尋求和解，也可能是損失正進一步擴大。放下傲慢，停止無謂的言語角力。" } },
  { upright: { keywords: ["渡過難關", "療癒之旅", "逐漸轉好"], meaning: "帶著傷痛慢慢復原，正踏上一段渡過難關的療癒之旅，遠離混亂、平靜前進。保持信心，方向是對的。" }, reversed: { keywords: ["無法擺脫困境", "持續發酵", "陷入迴圈"], meaning: "無法擺脫困境，問題持續發酵，溝通也陷入重複的迴圈。找出阻礙你前進的根本錨點，徹底剪斷舊包袱。" } },
  { upright: { keywords: ["策略性思考", "避開衝突", "隱瞞"], meaning: "運用策略性思考避開正面衝突，可能帶有隱瞞或缺乏坦誠的成分。靈活應變是好事，但切記勿觸碰底線。" }, reversed: { keywords: ["東窗事發", "謊言揭穿", "坦承錯誤"], meaning: "東窗事發，謊言被揭穿，計謀也隨之失敗。開誠布公、勇於承擔責任，是重塑信任的唯一出路。" } },
  { upright: { keywords: ["畫地為牢", "無助感", "思維陷阱"], meaning: "感到處處受限、無助，其實多半是自我思維畫地為牢所致。眼罩並沒有綁死，試著改變心態與視角。" }, reversed: { keywords: ["思想解脫", "擺脫限制", "重獲自由"], meaning: "思想終於解脫，擺脫限制、找到突破口，重獲自由並看清了真相。勇敢跨出第一步，拿回主導權。" } },
  { upright: { keywords: ["焦慮", "失眠", "過度擔憂"], meaning: "巨大的壓力帶來焦慮與失眠，精神折磨源於過度擔憂與內心恐懼。你所擔憂的事，多半只存在於腦海中。" }, reversed: { keywords: ["走出焦慮", "最壞已過", "理性面對"], meaning: "走出焦慮的陰影，最壞的情況已經過去，你正轉向理性面對。停止自我折磨，專注於當下能做的事。" } },
  { upright: { keywords: ["絕境", "慘烈結束", "谷底"], meaning: "來到絕境與谷底，這是一個慘烈的結束，也是背叛的極致，卻同時是痛苦的終點。事情不會再更壞了。" }, reversed: { keywords: ["絕處逢生", "緩慢復甦", "起死回生"], meaning: "絕處逢生，正從打擊中緩慢復甦，逐漸走出極度痛苦的陰影。抱持希望，準備迎向黎明。" } },
];

const SWORDS_COURTS: Record<Court, MinorContent> = {
  page: { upright: { keywords: ["警覺性高", "求知欲強", "蒐集資訊"], meaning: "警覺性高、求知欲強，是個靈敏但略帶戒心、善於蒐集資訊的新人。" }, reversed: { keywords: ["散播謠言", "虛張聲勢", "缺乏計劃"], meaning: "散播謠言、虛張聲勢，說話不負責任，行事缺乏計劃。" } },
  knight: { upright: { keywords: ["銳不可擋", "目標明確", "直言不諱"], meaning: "銳不可擋、目標明確，直言不諱、行動迅捷，具備批判性思維。" }, reversed: { keywords: ["衝動莽撞", "言語毒辣", "不顧他人"], meaning: "衝動莽撞，言語毒辣，過度激進導致失敗，不顧他人感受。" } },
  queen: { upright: { keywords: ["獨立理性", "觀察敏銳", "界線分明"], meaning: "獨立理性、觀察敏銳，界線分明、開誠布公，具備極佳的洞察力。" }, reversed: { keywords: ["冷酷無情", "尖酸刻薄", "心懷怨恨"], meaning: "冷酷無情、尖酸刻薄，過度批判且心懷怨恨，容易閉鎖心扉。" } },
  king: { upright: { keywords: ["專業權威", "公正無私", "邏輯嚴密"], meaning: "頂級的專業權威，公正無私、邏輯嚴密，具備絕佳的決斷力。" }, reversed: { keywords: ["專制殘忍", "濫用規則", "冷血自私"], meaning: "專制殘忍，濫用法律或規則壓人，冷血自私且偏執己見。" } },
};

const PENTACLES_PIPS: MinorContent[] = [
  { upright: { keywords: ["實質機會", "財務回饋", "堅實起點"], meaning: "一個實質的機會正帶來財務回饋，這是充滿商業契機的堅實起點。把握這個機會，踏實地進行長遠規劃。" }, reversed: { keywords: ["錯失商機", "資金短缺", "缺乏基礎"], meaning: "錯失商機，資金短缺讓投資計畫流產，缺乏穩固的物質基礎。審慎評估財務風險，切勿投機取巧。" } },
  { upright: { keywords: ["靈活應變", "平衡任務", "適應變化"], meaning: "靈活應變地同時處理多個任務，資金週轉與生活節奏正在動態平衡中。保持彈性與幽默感，隨時調整優先順序。" }, reversed: { keywords: ["手忙腳亂", "財務失控", "無法兼顧"], meaning: "手忙腳亂讓財務失控、入不敷出，也無法兼顧多項任務。簡化生活，適度砍掉次要任務，專注核心。" } },
  { upright: { keywords: ["團隊合作", "專業技能", "獲得認可"], meaning: "跨領域的團隊合作順暢，專業技能受到肯定，正精益求精地建構著成果。重視分工，虛心請教專業人士。" }, reversed: { keywords: ["能力不足", "缺乏溝通", "分工不均"], meaning: "專業能力不足，團隊缺乏溝通、分工不均，品質也因此受影響。提升自我素養，重新建立溝通管道。" } },
  { upright: { keywords: ["保守固執", "守財", "缺乏安全感"], meaning: "保守固執地守財，鞏固已有的陣地，其實源於內心缺乏安全感。儲蓄是好事，但過度緊抓會阻礙成長。" }, reversed: { keywords: ["過度浪費", "投資失利", "放開手腳"], meaning: "過度浪費導致投資失利、破財，或者終於願意放開手腳投資未來。學會適度放手與分享，讓循環更健康。" } },
  { upright: { keywords: ["物質貧困", "被排擠", "孤立無援"], meaning: "物質陷入貧困，健康或財務出現危機，讓你感到被排擠、孤立無援。不要因自尊心而拒絕尋求援助。" }, reversed: { keywords: ["走出困境", "找到支援", "危機緩解"], meaning: "走出財務困境，找到新的支援，危機正逐漸獲得緩解。把握復甦期，重新建立穩固的安全網。" } },
  { upright: { keywords: ["施與受", "資源分配", "互惠"], meaning: "施與受之間找到了平衡，資源分配合理，貴人相助帶來互惠。保持感恩與平衡的心態，不論給予或接受。" }, reversed: { keywords: ["不公平待遇", "財務糾紛", "不平等付出"], meaning: "不公平的待遇或財務糾紛，讓資源分配顯得不平等。警惕帶有條件的餽贈，尋求建立真正平等的關係。" } },
  { upright: { keywords: ["長遠思考", "評估成果", "耐性等待"], meaning: "耕耘之後暫停下來，長遠思考並評估過往投入的成果。保持耐性，花時間評估效益再做下一步決策。" }, reversed: { keywords: ["缺乏耐性", "徒勞無功", "焦躁放棄"], meaning: "缺乏耐性讓投資顯得徒勞無功，收穫不如預期，容易焦躁放棄。若評估後方向錯誤，就及時止損。" } },
  { upright: { keywords: ["工匠精神", "專注細節", "技能提升"], meaning: "以工匠精神專注於細節，勤奮而務實地累積、提升技能。沉下心來精進自我，努力終將轉化為專業價值。" }, reversed: { keywords: ["走捷徑", "缺乏專注", "技術停滯"], meaning: "工作走捷徑，缺乏專注力，重複性的勞動讓人感到厭倦、技術停滯。找回對工作的熱情，注重基礎功。" } },
  { upright: { keywords: ["物質豐盛", "獨立自主", "自我成就"], meaning: "物質生活豐盛，獨立自主地享受著高雅品味與自我成就。自信地享有你努力獲得的成果，保持優雅自律。" }, reversed: { keywords: ["財務透支", "過度依賴", "表面光鮮"], meaning: "過度消費導致財務透支，或是過度依賴他人，表面光鮮實則空虛。培養真正的獨立能力，理智管理財務。" } },
  { upright: { keywords: ["家族基業", "傳統傳承", "長期穩定"], meaning: "家族基業穩固傳承，物質極致豐盛，長期穩定的榮華富貴正圍繞著你。建立長遠的系統，為未來打下基礎。" }, reversed: { keywords: ["家族糾紛", "財務損失", "基業動搖"], meaning: "家族企業出現糾紛，財務損失讓基業動搖，甚至涉及遺產爭奪。妥善處理家庭與財務糾紛，回歸問題本質。" } },
];

const PENTACLES_COURTS: Record<Court, MinorContent> = {
  page: { upright: { keywords: ["務實學習者", "好消息", "勤奮踏實"], meaning: "務實的學習者，帶來財務或工作上的好消息，勤奮踏實地規劃未來。" }, reversed: { keywords: ["目光短淺", "缺乏執行力", "態度散漫"], meaning: "目光短淺，缺乏執行力，容易浪費錢財，學習態度也顯得散漫。" } },
  knight: { upright: { keywords: ["極具耐性", "高度責任感", "按部就班"], meaning: "極具耐性、高度責任感，腳踏實地、值得信賴，按部就班地執行。" }, reversed: { keywords: ["墨守成規", "固執頑冥", "進度遲緩"], meaning: "墨守成規、固執頑冥，缺乏靈活性，工作進度顯得過於遲緩。" } },
  queen: { upright: { keywords: ["務實賢慧", "理財能力", "溫暖穩定"], meaning: "務實賢慧，具備理財能力，提供無微不至的照顧，溫暖且穩定。" }, reversed: { keywords: ["物質主義", "焦慮安全感", "忽視健康"], meaning: "過度物質主義，為安全感焦慮不已，甚至因此忽視身心健康。" } },
  king: { upright: { keywords: ["商業領袖", "財務專家", "成功穩重"], meaning: "商業帝國的領袖，財務專家般成功且穩重，是可靠的資助者。" }, reversed: { keywords: ["唯利是圖", "貪婪自私", "忽視情感"], meaning: "唯利是圖、貪婪自私，固執專橫，過度重視物質而忽視情感。" } },
};

const SUITS: { id: Suit; name: string; nameEn: string; symbol: string; pips: MinorContent[]; courts: Record<Court, MinorContent> }[] = [
  { id: "wands", name: "權杖", nameEn: "Wands", symbol: "🔥", pips: WANDS_PIPS, courts: WANDS_COURTS },
  { id: "cups", name: "聖杯", nameEn: "Cups", symbol: "💧", pips: CUPS_PIPS, courts: CUPS_COURTS },
  { id: "swords", name: "寶劍", nameEn: "Swords", symbol: "🗡️", pips: SWORDS_PIPS, courts: SWORDS_COURTS },
  { id: "pentacles", name: "錢幣", nameEn: "Pentacles", symbol: "🪙", pips: PENTACLES_PIPS, courts: PENTACLES_COURTS },
];

function buildMinorCard(id: number, suit: (typeof SUITS)[number], opts: { rank: number } | { court: Court }): TarotCard {
  const isCourt = "court" in opts;
  const content = isCourt ? suit.courts[opts.court] : suit.pips[opts.rank - 1];
  const name = suit.name + (isCourt ? COURT_META[opts.court].label : CHINESE_DIGITS[opts.rank - 1]);
  const nameEn = `${isCourt ? COURT_META[opts.court].en : RANK_NAMES_EN[opts.rank - 1]} of ${suit.nameEn}`;
  const numeral = isCourt ? COURT_META[opts.court].badge : String(opts.rank);

  return {
    id,
    numeral,
    name,
    nameEn,
    symbol: suit.symbol,
    suit: suit.id,
    ...(isCourt ? { court: opts.court } : { rank: opts.rank }),
    upright: content.upright,
    reversed: content.reversed,
  };
}

export const MINOR_ARCANA: TarotCard[] = SUITS.flatMap((suit, suitIndex) => {
  const base = 22 + suitIndex * 14;
  const pips = Array.from({ length: 10 }, (_, i) => buildMinorCard(base + i, suit, { rank: i + 1 }));
  const courts: Court[] = ["page", "knight", "queen", "king"];
  const courtCards = courts.map((court, i) => buildMinorCard(base + 10 + i, suit, { court }));
  return [...pips, ...courtCards];
});
MINOR_ARCANA.forEach((card) => {
  const image = MINOR_ARCANA_IMAGES[card.id];
  if (image) card.image = image;
});

/** The full 78-card deck: 22 major arcana + 56 minor arcana. */
export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

/** Cards that currently have the owner's finished artwork available on the site. */
export const ILLUSTRATED_DECK: TarotCard[] = FULL_DECK.filter((card) => Boolean(card.image));

export type CardDraw = { card: TarotCard; isReversed: boolean };

export function drawRandomCard(): CardDraw {
  const card = ILLUSTRATED_DECK[Math.floor(Math.random() * ILLUSTRATED_DECK.length)];
  const isReversed = Math.random() < 0.35;
  return { card, isReversed };
}

/** Draws `count` distinct cards, matching how a physical deck is dealt without repeats. */
export function drawUniqueCards(count: number): CardDraw[] {
  const pool = [...ILLUSTRATED_DECK];
  const draws: CardDraw[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const [card] = pool.splice(idx, 1);
    draws.push({ card, isReversed: Math.random() < 0.35 });
  }
  return draws;
}
