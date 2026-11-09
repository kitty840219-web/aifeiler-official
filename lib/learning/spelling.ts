import type {Bank,Question} from "./types";
const rows={
  "p1": [
    [
      "cat",
      "貓",
      "中間是 a，結尾是 t。",
      "The cat is on the mat.",
      "貓在墊子上。"
    ],
    [
      "dog",
      "狗",
      "中間的母音字母是 o。",
      "I have a small dog.",
      "我有一隻小狗。"
    ],
    [
      "sun",
      "太陽",
      "這個字以 s 開頭，以 n 結尾。",
      "The sun is bright.",
      "太陽很明亮。"
    ],
    [
      "pen",
      "筆",
      "中間是 e，不是 a。",
      "This is my pen.",
      "這是我的筆。"
    ],
    [
      "red",
      "紅色",
      "先聽開頭的 r，再找中間的 e。",
      "The bag is red.",
      "袋子是紅色的。"
    ],
    [
      "map",
      "地圖",
      "開頭是 m，中間是 a。",
      "Look at the map.",
      "看看地圖。"
    ],
    [
      "cup",
      "杯子",
      "中間的母音字母是 u。",
      "The cup is blue.",
      "杯子是藍色的。"
    ],
    [
      "bus",
      "公車",
      "三個字母，先 b，再 u，最後 s。",
      "I see a bus.",
      "我看到一輛公車。"
    ]
  ],
  "p2": [
    [
      "apple",
      "蘋果",
      "apple 裡有兩個連在一起的 p。",
      "I eat an apple every day.",
      "我每天吃一顆蘋果。"
    ],
    [
      "book",
      "書",
      "中間有兩個 o。",
      "This book is about a bear.",
      "這本書在介紹一隻熊。"
    ],
    [
      "fish",
      "魚",
      "結尾的 sh 是常見的字母組合。",
      "A fish is in the pond.",
      "池塘裡有一條魚。"
    ],
    [
      "milk",
      "牛奶",
      "注意結尾是 l 接 k。",
      "I drink milk in the morning.",
      "我早上喝牛奶。"
    ],
    [
      "chair",
      "椅子",
      "開頭 ch，接著是 air。",
      "Please sit on the chair.",
      "請坐在椅子上。"
    ],
    [
      "green",
      "綠色",
      "中間 ee 連在一起。",
      "The leaves are green.",
      "葉子是綠色的。"
    ],
    [
      "happy",
      "開心的",
      "中間兩個 p，最後是 y。",
      "We are happy to see you.",
      "我們很高興見到你。"
    ],
    [
      "tiger",
      "老虎",
      "開頭 ti，結尾 ger。",
      "The tiger has stripes.",
      "老虎身上有條紋。"
    ]
  ],
  "p3": [
    [
      "school",
      "學校",
      "開頭是 sch，中間有兩個 o。",
      "I walk to school with my sister.",
      "我和姊姊走路去學校。"
    ],
    [
      "friend",
      "朋友",
      "記得是 ie，不是 ei。",
      "My friend likes drawing.",
      "我的朋友喜歡畫畫。"
    ],
    [
      "family",
      "家庭",
      "開頭 fam，結尾 ily。",
      "My family cooks together on Sundays.",
      "我的家人在星期日一起煮飯。"
    ],
    [
      "garden",
      "花園",
      "分成 gar 和 den 來記。",
      "We grow flowers in the garden.",
      "我們在花園種花。"
    ],
    [
      "weather",
      "天氣",
      "開頭 wea，後面 ther。",
      "The weather is warm today.",
      "今天天氣溫暖。"
    ],
    [
      "library",
      "圖書館",
      "結尾是 rary，不是 ry 而已。",
      "Please be quiet in the library.",
      "在圖書館請保持安靜。"
    ],
    [
      "holiday",
      "假日",
      "前半 holi，後半 day。",
      "We visit our grandparents during the holiday.",
      "我們在假日期間探望祖父母。"
    ],
    [
      "because",
      "因為",
      "先 be，再 cause。",
      "I stayed inside because it was raining.",
      "因為下雨，我待在室內。"
    ]
  ],
  "junior": [
    [
      "exercise",
      "運動；練習",
      "注意中間是 erc，不是 ers。",
      "Regular exercise helps me feel energetic.",
      "規律運動讓我覺得有精神。"
    ],
    [
      "important",
      "重要的",
      "結尾是 ant。",
      "It is important to get enough sleep.",
      "睡眠充足很重要。"
    ],
    [
      "different",
      "不同的",
      "中間有兩個 f，結尾是 ent。",
      "We have different ideas.",
      "我們有不同的想法。"
    ],
    [
      "remember",
      "記得",
      "分成 re、mem、ber。",
      "Please remember to bring your notebook.",
      "請記得帶筆記本。"
    ],
    [
      "future",
      "未來",
      "開頭 fu，後面 ture。",
      "What would you like to do in the future?",
      "你未來想做什麼？"
    ],
    [
      "healthy",
      "健康的",
      "health 後面加 y。",
      "Eating vegetables is part of a healthy diet.",
      "吃蔬菜是健康飲食的一部分。"
    ],
    [
      "practice",
      "練習",
      "此題用美式拼法，結尾 ice。",
      "I practice the piano after school.",
      "我放學後練琴。"
    ],
    [
      "protect",
      "保護",
      "前面 pro，後面 tect。",
      "We should protect the environment.",
      "我們應該保護環境。"
    ]
  ],
  "senior": [
    [
      "environment",
      "環境",
      "分成 en、viron、ment。",
      "Our choices can affect the environment.",
      "我們的選擇可能影響環境。"
    ],
    [
      "responsible",
      "負責任的",
      "注意結尾是 ible。",
      "Each member is responsible for one task.",
      "每位成員負責一項工作。"
    ],
    [
      "opportunity",
      "機會",
      "中間兩個 p，結尾 unity。",
      "The project gave me an opportunity to learn.",
      "這項專案給了我學習的機會。"
    ],
    [
      "confidence",
      "信心",
      "分成 con、fi、dence。",
      "Practice helped her gain confidence.",
      "練習幫助她建立信心。"
    ],
    [
      "perspective",
      "觀點",
      "開頭 per，結尾 spective。",
      "The story offers a different perspective.",
      "這個故事提供了不同觀點。"
    ],
    [
      "evidence",
      "證據",
      "開頭 evi，結尾 dence。",
      "We need more evidence before making a decision.",
      "做決定前，我們需要更多證據。"
    ],
    [
      "efficient",
      "有效率的",
      "中間有兩個 f，結尾 ient。",
      "This method is simple and efficient.",
      "這個方法簡單又有效率。"
    ],
    [
      "consequence",
      "後果",
      "分成 con、se、quence。",
      "Consider the consequence of each choice.",
      "想想每個選擇可能帶來的後果。"
    ]
  ],
  "college": [
    [
      "hypothesis",
      "假說",
      "開頭 hypo，結尾 thesis。",
      "The experiment was designed to test the hypothesis.",
      "這項實驗是為了檢驗假說而設計。"
    ],
    [
      "methodology",
      "研究方法",
      "method 後面加 ology。",
      "The report explains the research methodology.",
      "報告說明了研究方法。"
    ],
    [
      "sustainable",
      "可持續的；永續的",
      "sustain 後面加 able。",
      "The team is developing a sustainable transport plan.",
      "團隊正在制定永續交通方案。"
    ],
    [
      "collaboration",
      "合作",
      "collab 開頭有兩個 l。",
      "The study depends on collaboration between departments.",
      "這項研究仰賴系所之間的合作。"
    ],
    [
      "interpretation",
      "詮釋",
      "interpret 後面接 ation。",
      "Her interpretation is supported by several examples.",
      "她的詮釋有數個例子支持。"
    ],
    [
      "accountability",
      "問責；負責義務",
      "account 後面加 ability。",
      "Clear records improve accountability.",
      "清楚的紀錄有助於落實問責。"
    ],
    [
      "consensus",
      "共識",
      "結尾是 sus，不是 ses。",
      "The group reached a consensus after discussion.",
      "團體在討論後達成共識。"
    ],
    [
      "transparency",
      "透明度",
      "開頭 trans，結尾 parency。",
      "Transparency helps build public trust.",
      "透明度有助於建立公眾信任。"
    ]
  ]
};
export const SPELLING_BANK:Bank=Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([word,meaning,hint,example,exampleZh],i):Question=>({id:`spelling-${level}-${i}`,kind:"tokens",lang:"en",prompt:`聽發音或看中文，拼出「${meaning}」的英文。`,correct:word,solutions:[word.toUpperCase().split("")],tiles:[...word.toUpperCase().split(""),...(level==="p1"?[]:["Q","Z"].filter(letter=>!word.toUpperCase().includes(letter)))],hint,explanation:`${word}：${meaning}。${hint}`,speech:word,example,exampleZh}))])) as Bank;

