import { CardDraw, TarotCard } from "./cards";

export type ReadingStyle = "roast" | "intuitive" | "insight";
export type ReadingReport = { title: string; personality?: string; paragraphs: string[]; summary: string };

type Domain = "感情" | "工作" | "金錢" | "人際" | "自我";
type Intent = "想法感受" | "未來發展" | "復合可能" | "行動建議" | "結果判斷";
type Profile = { question: string; domain: Domain; intent: Intent };

const DOMAIN_WORDS: Record<Domain, string[]> = {
  感情: ["愛", "感情", "喜歡", "曖昧", "復合", "分手", "他", "她", "對方", "關係", "交往", "婚姻", "想法", "感受"],
  工作: ["工作", "職場", "事業", "主管", "同事", "面試", "錄取", "轉職", "升遷", "創業", "客戶", "合作", "公司"],
  金錢: ["錢", "財運", "收入", "投資", "股票", "生意", "業績", "債", "買房"],
  人際: ["朋友", "家人", "人際", "相處", "誤會", "溝通", "友情"],
  自我: ["自己", "人生", "方向", "選擇", "未來", "運勢", "課題", "學業", "考試"],
};

const CONTEXT: Record<Domain, { lens: string; action: string }> = {
  感情: {
    lens: "這段關係真正需要看的，不只是有沒有感覺，而是雙方是否願意用一致且持續的行動承接感受。",
    action: "觀察對方是否主動聯繫、延續對話並安排實際相處；穩定的行動，比一時的情緒更能說明關係走向。",
  },
  工作: {
    lens: "這個工作議題的重點在現實條件、執行節奏，以及能力能否轉化為看得見的成果。",
    action: "把下一步拆成可驗證的小目標，主動確認時程、權責與資源，不要只依賴口頭承諾。",
  },
  金錢: {
    lens: "牌面要求你同時衡量機會與風險；短期波動不等於長期結果，現金流和承受能力才是關鍵。",
    action: "先設定可承受的上限與停損條件，保留必要預備金，再決定是否投入更多資源。",
  },
  人際: {
    lens: "目前的關鍵是彼此接收到的訊息是否一致；不舒服可能來自沒有說清楚，不一定等於惡意。",
    action: "用具體事件表達感受與界線，避免猜測動機，也觀察對方是否願意回應與調整。",
  },
  自我: {
    lens: "這個問題正在要求你釐清真正重視的價值，而不是只選擇最不會讓別人失望的答案。",
    action: "寫下最想得到與最怕失去的各三件事，再選一個近期可以實際驗證的方向。",
  },
};

const OPENERS: Record<ReadingStyle, string[]> = {
  roast: ["先講結論，不繞圈子。", "把期待先放旁邊，牌面說得很直接。"],
  intuitive: ["把注意力放回你的問題，這張牌首先浮現的是一股很明確的感受。", "這張牌正在回應你問題裡最在意、卻還沒有說出口的部分。"],
  insight: ["從問題的核心與牌面結構來看，", "針對你提供的情境，把問題拆開後可以看見："],
};

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return hash;
}

function pick<T>(items: T[], seed: number) {
  return items[seed % items.length];
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function analyzeQuestion(raw: string): Profile {
  const question = raw.trim();
  let domain: Domain = "自我";
  let bestScore = 0;
  (Object.keys(DOMAIN_WORDS) as Domain[]).forEach((candidate) => {
    const score = DOMAIN_WORDS[candidate].filter((word) => question.includes(word)).length;
    if (score > bestScore) {
      domain = candidate;
      bestScore = score;
    }
  });

  let intent: Intent = "結果判斷";
  if (hasAny(question, ["想法", "感受", "心裡", "怎麼看", "喜歡我", "在想什麼"])) intent = "想法感受";
  else if (hasAny(question, ["復合", "回來", "和好", "重新在一起"])) intent = "復合可能";
  else if (hasAny(question, ["未來", "接下來", "發展", "三個月", "走向", "之後"])) intent = "未來發展";
  else if (hasAny(question, ["怎麼做", "該如何", "建議", "要不要", "選擇"])) intent = "行動建議";
  return { question, domain, intent };
}

function reportTitle(profile: Profile) {
  const titles: Record<Intent, string> = {
    想法感受: "關於對方想法、感受與目前心境的解讀",
    未來發展: "關於未來發展與可能走向的解讀",
    復合可能: "關於復合可能與關係狀態的解讀",
    行動建議: "關於下一步選擇與行動方向的解讀",
    結果判斷: `關於這個${profile.domain}問題的整體解讀`,
  };
  return titles[profile.intent];
}

function directAnswer(profile: Profile, card: TarotCard, reversed: boolean) {
  const flow = reversed
    ? "目前能量受阻，答案不是完全否定，而是仍有猶豫、誤解或尚未處理的因素。"
    : "目前能量可以向前流動，但這代表具備發展條件，不是不用經營就會實現的保證。";
  switch (profile.intent) {
    case "想法感受":
      return reversed
        ? `就你問的「${profile.question}」而言，對方並非毫無感受，但更傾向壓抑、觀望或保護自己。${flow}`
        : `就你問的「${profile.question}」而言，對方對你有一定程度的注意與情緒連結，只是表達方式未必直接。${flow}`;
    case "復合可能":
      return reversed
        ? `針對「${profile.question}」，短期復合阻力仍高。真正的問題不是有沒有想念，而是舊有相處模式是否已經改變。${flow}`
        : `針對「${profile.question}」，關係仍有重新靠近的空間，但復合需要新的相處方式，不能只回到原本的循環。${flow}`;
    case "未來發展":
      return `針對「${profile.question}」，事情接下來會沿著「${card.name}」所代表的課題發展。${flow}`;
    case "行動建議":
      return `針對「${profile.question}」，現在最重要的不是急著做出完美決定，而是先處理「${card.name}」揭示的核心問題。${flow}`;
    default:
      return `針對「${profile.question}」，牌面不是只給單純的是或否，而是指出結果取決於你如何回應「${card.name}」帶出的課題。${flow}`;
  }
}

function singleReport(card: TarotCard, reversed: boolean, question: string, styles: ReadingStyle[]): ReadingReport {
  const profile = analyzeQuestion(question);
  const orientation = reversed ? card.reversed : card.upright;
  const seed = hashString(`${card.id}-${reversed}-${question}`);
  const opener = pick(OPENERS[styles[0] ?? "insight"], seed);
  const context = CONTEXT[profile.domain];
  const paragraphs = [
    `${opener}你抽到${reversed ? "逆位" : "正位"}的「${card.name}」，核心訊息是「${orientation.keywords.join("、")}」。`,
    `${directAnswer(profile, card, reversed)} ${orientation.meaning}`,
    `${reversed ? "逆位表示這股能量正以延遲、內耗或過度的方式出現。" : "正位表示這股能量有機會被成熟而穩定地運用。"}${context.lens}`,
    `接下來可以這樣驗證牌面：${context.action}`,
  ];
  const summary = reversed
    ? "這件事目前仍有阻力。先不要把短暫反應當成最終答案，真正的轉機來自看清問題並調整互動方式。"
    : "牌面存在正向發展的條件，但仍需要現實中的行動與時間確認。保持清楚的界線，也給事情自然發展的空間。";
  return { title: reportTitle(profile), paragraphs, summary };
}

export function generateReading(card: TarotCard, isReversed: boolean, question: string, styles: ReadingStyle[]): ReadingReport {
  return singleReport(card, isReversed, question, styles);
}

const POSITIONS = ["過去", "現在", "未來"] as const;

export function generateThreeCardReading(draws: [CardDraw, CardDraw, CardDraw], question: string, styles: ReadingStyle[]): ReadingReport {
  const profile = analyzeQuestion(question);
  const context = CONTEXT[profile.domain];
  const paragraphs = draws.map((draw, index) => {
    const orientation = draw.isReversed ? draw.card.reversed : draw.card.upright;
    const role = index === 0 ? "形成現況的背景" : index === 1 ? "當下最需要面對的狀態" : "照目前節奏延續的可能走向";
    return `${POSITIONS[index]}｜${draw.isReversed ? "逆位" : "正位"}「${draw.card.name}」：這張牌代表${role}。${orientation.meaning}`;
  });
  const future = draws[2];
  paragraphs.push(`把三張牌放回你的問題「${profile.question}」來看，過去的經驗仍在影響現在的判斷，而未來牌「${future.card.name}」顯示事情尚有變化空間。${context.lens}`);
  const summary = `${future.isReversed ? "短期發展仍可能反覆，不適合把期待當成承諾。" : "未來存在推進的可能，但需要以穩定行動讓它落地。"}${context.action}`;
  return { title: reportTitle(profile), paragraphs, summary };
}

export function generateFollowUp(draws: CardDraw[], followUpQuestion: string, styles: ReadingStyle[]) {
  const report = draws.length === 1
    ? singleReport(draws[0].card, draws[0].isReversed, followUpQuestion, styles)
    : generateThreeCardReading(draws as [CardDraw, CardDraw, CardDraw], followUpQuestion, styles);
  return [...report.paragraphs.slice(1), `總結｜${report.summary}`].join("\n\n");
}
