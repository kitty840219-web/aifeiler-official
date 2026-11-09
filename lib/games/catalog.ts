export const GAME_CATEGORIES = [
  {
    "id": "all",
    "label": "全部遊戲"
  },
  {
    "id": "puzzle",
    "label": "益智解謎"
  },
  {
    "id": "memory",
    "label": "記憶挑戰"
  },
  {
    "id": "action",
    "label": "動作反應"
  },
  {
    "id": "adventure",
    "label": "冒險探索"
  },
  {
    "id": "sports",
    "label": "運動競技"
  },
  {
    "id": "garden",
    "label": "療癒養成"
  }
] as const;
export type GameCategory = typeof GAME_CATEGORIES[number]["id"];

export const ARCADE_GAMES = [
  {
    "slug": "memory",
    "title": "小艾翻翻樂",
    "icon": "🌼",
    "category": "記憶・插畫配對",
    "image": "/images/nav/nav-about.webp",
    "group": "memory"
  },
  {
    "slug": "stars",
    "title": "星光接接樂",
    "icon": "✦",
    "category": "挑戰・接住星光",
    "image": "/images/nav/nav-horoscope.webp",
    "group": "action"
  },
  {
    "slug": "garden",
    "title": "小艾的心情花園",
    "icon": "🌷",
    "category": "每日・心情種花",
    "image": "/images/nav/nav-works.webp",
    "group": "garden"
  },
  {
    "slug": "snake",
    "title": "小艾貪食蛇",
    "icon": "🍎",
    "category": "經典・方向挑戰",
    "image": "/images/games/xiaoai-apple-v2.png",
    "group": "action"
  },
  {
    "slug": "mines",
    "title": "星光踩地雷",
    "icon": "💣",
    "category": "推理・安全探索",
    "image": "",
    "group": "puzzle"
  },
  {
    "slug": "tic-tac-toe",
    "title": "立體圈叉",
    "icon": "⭕",
    "category": "益智・單雙人",
    "image": "",
    "group": "puzzle"
  },
  {
    "slug": "tiles",
    "title": "繽紛方塊樂",
    "icon": "💎",
    "category": "益智・三張配對",
    "image": "",
    "group": "puzzle"
  },
  {
    "slug": "half-moon",
    "title": "半月星牌",
    "icon": "🌗",
    "category": "紙牌・月相連結",
    "image": "",
    "group": "puzzle"
  },
  {
    "slug": "pani-puri",
    "title": "印度酥炸球小舖",
    "icon": "🥔",
    "category": "益智・訂單配對",
    "image": "",
    "group": "puzzle"
  },
  {
    "slug": "ocean-memory",
    "title": "海洋記憶遊戲",
    "icon": "🐙",
    "category": "記憶・節奏順序",
    "image": "",
    "group": "memory"
  },
  {
    "slug": "solitaire",
    "title": "小艾紙牌接龍",
    "icon": "🃏",
    "category": "紙牌・經典接龍",
    "image": "",
    "group": "puzzle"
  },
  {
    "slug": "baseball",
    "title": "小艾棒球場",
    "icon": "⚾",
    "category": "運動・擊球時機",
    "image": "",
    "group": "sports"
  },
  {
    "slug": "cricket",
    "title": "草地板球",
    "icon": "🏏",
    "category": "運動・節奏打擊",
    "image": "",
    "group": "sports"
  },
  {
    "slug": "breakout",
    "title": "星光磚塊爆破樂",
    "icon": "🧱",
    "category": "經典・反彈挑戰",
    "image": "",
    "group": "action"
  },
  {
    "slug": "maze",
    "title": "小精靈星光迷宮",
    "icon": "🌟",
    "category": "經典・迷宮探索",
    "image": "",
    "group": "adventure"
  },
  {
    "slug": "gnomes",
    "title": "花園地精彈射",
    "icon": "🧙",
    "category": "動作・彈射距離",
    "image": "",
    "group": "action"
  },
  {
    "slug": "pony",
    "title": "小艾驛馬快信",
    "icon": "🐎",
    "category": "動作・收信冒險",
    "image": "",
    "group": "action"
  },
  {
    "slug": "popcorn",
    "title": "爆米花躲躲派對",
    "icon": "🍿",
    "category": "派對・同裝置雙人",
    "image": "",
    "group": "action"
  },
  {
    "slug": "petanque",
    "title": "小艾法式滾球",
    "icon": "⚪",
    "category": "運動・瞄準拋球",
    "image": "",
    "group": "sports"
  },
  {
    "slug": "platform",
    "title": "立體方塊工坊",
    "icon": "🧩",
    "category": "動作・關卡編輯",
    "image": "",
    "group": "adventure"
  },
  {
    "slug": "island",
    "title": "小艾冠軍小島",
    "icon": "🏝️",
    "category": "冒險・徽章試煉",
    "image": "",
    "group": "adventure"
  },
  {
    "slug": "halloween",
    "title": "月夜魔法學院",
    "icon": "🪄",
    "category": "冒險・方向施法",
    "image": "",
    "group": "action"
  }
] as const;
