"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { CardDraw, FULL_DECK, TarotCard, drawUniqueCards } from "@/lib/tarot/cards";
import { asset } from "@/lib/basePath";
import CardArt from "@/components/tarot/CardArt";
import { ReadingReport, ReadingStyle } from "@/lib/tarot/reading";
import { BirthInfo, RELATIONSHIP_POSITION_LABELS, requestAiReading } from "@/lib/tarot/ai";
import { getCardOrigin } from "@/lib/tarot/origins";

import { FOLLOW_UP_LIMIT, FollowUpEntry, SavedReading, loadHistory, saveReading, deleteReading } from "@/lib/tarot/history";

type Step = "cover" | "form" | "shuffle" | "spread" | "analyzing" | "reveal" | "history";
type SpreadSize = 1 | 3 | 5;

const STYLE_OPTIONS: { id: ReadingStyle; label: string; emoji: string; badge?: string }[] = [
  { id: "roast", label: "火烤", emoji: "🔥" },
  { id: "intuitive", label: "直覺式", emoji: "🖐️" },
  { id: "insight", label: "洞察", emoji: "🔍", badge: "BETA" },
];

const SPREAD_MODES: { id: SpreadSize; label: string; hint: string }[] = [
  { id: 1, label: "單題", hint: "聚焦一個問題，獲得清楚指引" },
  { id: 3, label: "三題", hint: "從三個角度，看見事情全貌" },
  { id: 5, label: "五題", hint: "完整分析現況、想法與未來走向" },
];

const TOPIC_OPTIONS = [
  { id: "reconcile", label: "復合", questions: ["目前對方對我的真實想法", "目前對方對復合的想法", "分開後真正的問題點", "未來三個月的復合機會", "我該如何提升復合可能性"] },
  { id: "relationship", label: "感情發展", questions: ["目前這段關係的能量狀態", "未來三個月的感情走勢", "對方現在如何看待我", "對方如何看待這段關係", "這段關係的阻礙與關鍵點"] },
  { id: "ambiguous", label: "曖昧關係", questions: ["目前對方對我的感覺", "對方是否有喜歡我的傾向", "未來是否有機會正式交往", "目前關係停滯的主要原因", "我該如何拉近彼此的距離"] },
  { id: "single", label: "脫單桃花", questions: ["目前影響我脫單的原因", "近期三個月的桃花運勢", "下一段對象可能具備的特質", "未來三個月的脫單機會", "我該如何提升戀愛能量"] },
  { id: "breakup", label: "分手斷聯", questions: ["我們分手或斷聯的核心原因", "對方目前對我的想法與感受", "對方是否可能主動聯繫我", "未來三個月是否有復合機會", "我該如何做才能增加轉機"] },
  { id: "career", label: "工作事業", questions: ["目前三個月的工作運勢", "這份工作是否適合我繼續發展", "主管或重要合作對象如何看待我", "目前職場最需要留意的人際關係", "我該如何提升工作運與發展機會"] },
  { id: "money", label: "金錢財運", questions: ["目前的財運能量與狀態", "未來三個月的財運趨勢", "近期主要的財源與機會", "目前容易漏財或破財的原因", "我該如何改善並提升財運"] },
  { id: "family", label: "家庭人際", questions: ["目前家庭或人際關係的狀態", "彼此之間尚未說開的課題", "未來三個月關係會如何變化", "目前溝通最需要注意的地方", "我可以如何改善這段關係"] },
  { id: "study", label: "學業考試", questions: ["目前的學習能量與狀態", "近期考試或評量的整體趨勢", "目前最容易卡關的地方", "接下來的讀書效率與進展", "我該如何調整以提升表現"] },
  { id: "growth", label: "自我成長", questions: ["目前我的內在狀態與核心需求", "我現在最值得發揮的優勢與天賦", "目前限制我前進的信念或習慣", "未來三個月適合發展的方向", "我該如何提升並整合自己的能量"] },
] as const;

const POSITION_LABELS = ["過去", "現在", "未來"];
const defaultPositionLabels = (size: SpreadSize): readonly string[] => size === 5 ? RELATIONSHIP_POSITION_LABELS : size === 3 ? POSITION_LABELS : ["核心訊息"];
const SPREAD_COUNT = 40;

// deterministic seeded RNG so server-render and client hydration match
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function CardBack({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/images/tarot/back.webp")} alt="塔羅牌背面" loading="eager" decoding="async" className="h-full w-full object-contain" />
    </div>
  );
}

const ELEMENT_ICON: Record<NonNullable<TarotCard["element"]>, string> = { 火: "🔥", 水: "💧", 風: "🌬️", 土: "⛰️" };

function ElementBadge({ element, compact = false }: { element: NonNullable<TarotCard["element"]>; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-gold-light/30 bg-paper/5 text-gold-light/80 ${
        compact ? "px-1.5 py-0 text-[9px]" : "px-2 py-0.5 text-[11px]"
      }`}
    >
      <span>{ELEMENT_ICON[element]}</span>
      {element}元素
    </span>
  );
}

function CardFront({ card, isReversed, compact = false }: { card: TarotCard; isReversed: boolean; compact?: boolean }) {
  return (
    <div className={`h-full w-full ${isReversed ? "rotate-180" : ""}`}>
      <CardArt card={card} className="h-full w-full" />
    </div>
  );
}

function CardCaption({ card, isReversed, label, compact = false }: { card: TarotCard; isReversed: boolean; label?: string; compact?: boolean }) {
  return (
    <div className="space-y-0.5 text-center">
      {label && <p className="text-[11px] text-gold-light/70">{label}</p>}
      <p className={`font-semibold text-paper ${compact ? "text-xs" : "text-sm"}`}>{card.name}</p>
      <p className={`text-gold-light/50 ${compact ? "text-[9px]" : "text-[10px]"}`}>
        {card.nameEn}
        {isReversed && "（逆位）"}
      </p>
    </div>
  );
}


function ReadingCard({ draw, label, children }: { draw: CardDraw; label: string; children: ReactNode }) {
  return (
    <article className="rounded-xl border border-gold-light/20 bg-paper/5 p-4">
      <h3 className="mb-4 break-words text-sm font-semibold leading-6 text-paper">{label}：{draw.card.name}{draw.isReversed ? "（逆位）" : "（正位）"}</h3>
      <div className="mx-auto mb-3 h-64 w-40"><CardFront card={draw.card} isReversed={draw.isReversed} /></div>
      <CardCaption card={draw.card} isReversed={draw.isReversed} />
      <div className="my-3 flex flex-wrap items-center justify-center gap-1.5">
        {draw.card.element && <ElementBadge element={draw.card.element} />}
        {(draw.isReversed ? draw.card.reversed : draw.card.upright).keywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-gold-light/30 px-2 py-0.5 text-[11px] text-gold-light/80">#{keyword}</span>
        ))}
      </div>
      <div className="space-y-4 whitespace-pre-line break-words text-sm leading-7 text-paper/90">{children}</div>
    </article>
  );
}

type TarotDomain = "感情" | "事業" | "財運";

function domainFocus(card: TarotCard, domain: TarotDomain, reversed: boolean) {
  const suitFocus: Record<TarotDomain, Record<string, string>> = {
    感情: {
      cups: "留意彼此的感受是否被理解，也要讓情緒有誠實流動的空間。",
      wands: "觀察吸引力與熱情是否能化成持續的行動，而不只是一時衝動。",
      swords: "溝通方式與真實想法是關鍵，把問題說清楚才能減少猜測與誤會。",
      pentacles: "安全感、承諾與穩定相處是核心，應從長期行動判斷關係品質。",
      major: "這段關係正面對重要的內在課題，需要看見彼此真正的選擇與需求。",
    },
    事業: {
      cups: "工作滿足感、團隊互動與創意表達會影響接下來的發展。",
      wands: "行動力、企圖心與執行速度是突破現況的重點。",
      swords: "需要清楚分析資訊、溝通立場，並用理性做出決策。",
      pentacles: "務實規劃、專業能力與穩定累積會決定成果。",
      major: "這是職涯方向的重要提醒，應從長期目標重新評估眼前選擇。",
    },
    財運: {
      cups: "消費容易受到情緒與人情影響，金錢決定要回到實際需求。",
      wands: "財務機會來自行動與開拓，但仍需衡量風險，避免衝動投入。",
      swords: "帳務、合約與資訊需要仔細核對，避免因判斷太快而產生損失。",
      pentacles: "收入、儲蓄與資源管理是焦點，穩健配置比短期冒險更重要。",
      major: "財務狀況反映目前的人生選擇，需同時考量價值觀與長期安全感。",
    },
  };
  const key = card.suit || "major";
  const closing = suitFocus[domain][key];
  return reversed ? `目前更需要先處理阻礙與盲點。${closing}` : `目前可以順勢發揮這股能量。${closing}`;
}

function domainMeaning(card: TarotCard, domain: TarotDomain, reversed: boolean) {
  const reading = reversed ? card.reversed : card.upright;
  return `${card.name}${reversed ? "逆位" : "正位"}在${domain}上代表「${reading.keywords.join("、")}」。${reading.meaning}${domainFocus(card, domain, reversed)}`;
}

function TarotGuideModal({ selectedCard, onSelect, onClose }: { selectedCard: TarotCard | null; onSelect: (card: TarotCard | null) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 pt-8" onClick={onClose}>
      <div className="relative flex h-full max-h-[88svh] w-full max-w-[430px] flex-col overflow-hidden rounded-[1.5rem] border border-gold-light/30 bg-night-dark text-paper" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="關閉塔羅牌介紹" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold-light text-xl font-bold text-[#0b0f2e] shadow-soft">✕</button>
        <div className="overflow-y-auto px-5 pb-8 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {selectedCard ? (
            <article>
              <button type="button" onClick={() => onSelect(null)} className="mb-5 pr-14 text-sm font-semibold text-gold-light">← 返回全部牌卡</button>
              <div className="mx-auto h-96 w-60"><CardArt card={selectedCard} className="h-full w-full" /></div>
              <div className="mt-5 text-center">
                <p className="text-xs text-gold-light/60">{selectedCard.numeral}</p>
                <h2 className="mt-1 text-2xl font-semibold text-paper">{selectedCard.name}</h2>
                <p className="mt-1 text-sm text-gold-light/60">{selectedCard.nameEn}</p>
              </div>
              <section className="mt-6 rounded-xl border border-gold-light/25 bg-paper/5 p-4">
                <h3 className="font-semibold text-paper">牌卡的由來與象徵</h3>
                <p className="mt-3 text-sm leading-7 text-paper/85">{getCardOrigin(selectedCard)}</p>
              </section>
              <section className="mt-6 rounded-xl border border-gold-light/25 bg-paper/5 p-4">
                <h3 className="font-semibold text-paper">正位牌義</h3>
                <div className="my-3 flex flex-wrap gap-1.5">{selectedCard.upright.keywords.map((keyword) => <span key={keyword} className="rounded-full border border-gold-light/25 px-2 py-1 text-[11px] text-gold-light">#{keyword}</span>)}</div>
                <p className="text-sm leading-7 text-paper/85">{selectedCard.upright.meaning}</p>
              </section>
              <section className="mt-4 rounded-xl border border-gold-light/25 bg-paper/5 p-4">
                <h3 className="font-semibold text-paper">逆位牌義</h3>
                <div className="my-3 flex flex-wrap gap-1.5">{selectedCard.reversed.keywords.map((keyword) => <span key={keyword} className="rounded-full border border-gold-light/25 px-2 py-1 text-[11px] text-gold-light">#{keyword}</span>)}</div>
                <p className="text-sm leading-7 text-paper/85">{selectedCard.reversed.meaning}</p>
              </section>
              <div className="mt-6 border-t border-gold-light/25 pt-6">
                <h3 className="text-lg font-semibold text-paper">不同面向的牌義</h3>
                <p className="mt-1 text-xs text-gold-light/55">將這張牌運用在感情、事業與財運問題時的解讀</p>
                {(["感情", "事業", "財運"] as TarotDomain[]).map((domain) => (
                  <section key={domain} className="mt-4 rounded-xl border border-gold-light/25 bg-paper/5 p-4">
                    <h4 className="font-semibold text-paper">{domain}</h4>
                    <div className="mt-3 space-y-4 text-sm leading-7 text-paper/85">
                      <div><p className="mb-1 font-semibold text-gold-light">正位</p><p>{domainMeaning(selectedCard, domain, false)}</p></div>
                      <div className="border-t border-gold-light/15 pt-4"><p className="mb-1 font-semibold text-gold-light">逆位</p><p>{domainMeaning(selectedCard, domain, true)}</p></div>
                    </div>
                  </section>
                ))}
              </div>
              <button type="button" onClick={() => onSelect(null)} className="mt-6 w-full rounded-xl border border-gold-light/40 py-3 text-sm font-semibold text-paper">返回全部牌卡</button>
            </article>
          ) : (
            <section>
              <div className="pr-14">
                <h2 className="text-2xl font-semibold text-paper">塔羅牌介紹</h2>
                <p className="mt-2 text-xs leading-6 text-gold-light/60">完整 78 張塔羅牌｜點擊牌卡查看正位與逆位含義</p>
              </div>
              <section className="mt-6 rounded-xl border border-gold-light/25 bg-paper/5 p-4">
                <h3 className="text-lg font-semibold text-paper">塔羅牌的由來</h3>
                <div className="mt-3 space-y-3 text-sm leading-7 text-paper/85">
                  <p>塔羅牌最早並不是占卜工具。現存文獻顯示，它在十五世紀的義大利北部發展成一種紙牌遊戲，當時常見於米蘭、威尼斯與佛羅倫斯等地。早期華麗的手繪牌組多由貴族委託製作，用來進行帶有王牌規則的娛樂遊戲。</p>
                  <p>後來逐漸形成今日熟悉的 78 張結構：22 張大阿爾克那，包括愚者與 21 張王牌；以及 56 張小阿爾克那，分為權杖、聖杯、寶劍、錢幣四個牌組。每個牌組包含數字牌一至十，以及侍者、騎士、皇后、國王。</p>
                  <p>直到十八世紀後期，歐洲才開始將塔羅牌系統性地運用於占卜；十九世紀的神祕學發展又加入象徵、數字與靈性詮釋，使塔羅成為探索處境與內在心理的工具。</p>
                  <p>二十世紀初出版的偉特－史密斯牌，由 Pamela Colman Smith 繪製圖像，讓小阿爾克那也具有完整情境畫面。這套視覺語言深深影響現代塔羅，許多新牌組仍以它的象徵架構重新創作。</p>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-gold-light/45">歷史資料參考：Victoria and Albert Museum、The Metropolitan Museum of Art</p>
              </section>
              <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6">
                {FULL_DECK.map((card) => (
                  <button key={card.id} type="button" onClick={() => onSelect(card)} className="min-w-0 text-center">
                    <div className="aspect-[2/3] w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(card.image!)} alt={card.name} loading="lazy" className="h-full w-full object-fill" />
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-paper">{card.name}</p>
                    <p className="mt-0.5 truncate text-[9px] text-gold-light/50">{card.nameEn}</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}


function FollowUpPanel({
  followUps,
  draft,
  onDraftChange,
  onSubmit,
  candidates,
  pickedIndex,
  onPickCandidate,
  loading,
}: {
  followUps: FollowUpEntry[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSubmit: () => void;
  candidates: CardDraw[] | null;
  pickedIndex: number | null;
  onPickCandidate: (i: number) => void;
  loading: boolean;
}) {
  const atLimit = followUps.length >= FOLLOW_UP_LIMIT;
  const canSubmit = draft.trim().length >= 10 && !atLimit && !loading;
  return (
    <div className="w-full space-y-3">
      <p className="text-xs text-gold-light/70">追問塔羅 · 已使用 {followUps.length} / {FOLLOW_UP_LIMIT} 次</p>
      {followUps.map((entry, index) => {
        const [analysis, ...summary] = entry.answer.split("\n\n總結｜");
        return (
          <ReadingCard key={index} draw={entry.card} label={`追問 ${index + 1}`}>
            <p className="rounded-lg bg-black/15 p-3 text-paper">追問：{entry.question}</p>
            <p>{analysis}</p>
            {summary.length > 0 && <section className="border-t border-gold-light/20 pt-4"><h4 className="mb-2 font-semibold text-paper">總結與建議</h4><p>{summary.join("\n\n")}</p></section>}
          </ReadingCard>
        );
      })}

      {atLimit ? <p className="rounded-xl border border-gold-light/20 p-4 text-sm text-paper">本次占卜已完成 5 次追問，隨時可在歷史紀錄回顧完整報告。</p> : candidates ? (
        <div className="w-full space-y-3 rounded-xl border border-gold-light/20 bg-paper/5 p-4 text-center">
          <p className="text-sm text-gold-light/70">{loading ? "正在為你解讀這張牌⋯" : "憑直覺抽一張牌，回答這次的追問"}</p>
          <div className="flex justify-center gap-3">
            {candidates.map((c, i) => (
              <button
                key={i}
                aria-label={`追問選擇第 ${i + 1} 張牌`}
                onClick={() => onPickCandidate(i)}
                disabled={pickedIndex !== null}
                className="h-28 w-20 shrink-0 transition-transform enabled:hover:-translate-y-1 disabled:cursor-default"
              >
                {pickedIndex === i ? (
                  <CardFront card={c.card} isReversed={c.isReversed} compact />
                ) : (
                  <CardBack className={`h-full w-full ${pickedIndex !== null ? "opacity-40" : ""}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <label className="mb-1 block text-xs text-gold-light/60">我想要追問</label>
          <textarea
            value={draft}
            maxLength={200}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="針對這次抽到的牌，還想多問一點什麼？"
            className="h-20 w-full resize-none rounded-xl border border-gold-light/30 bg-paper/5 p-3 text-sm text-paper placeholder:text-gold-light/40 focus:border-gold-light/70 focus:outline-none"
          />
          <div className="mt-1 flex justify-between text-[11px] text-gold-light/50">
            <span>至少 10 個字</span>
            <span>{draft.length}/200</span>
          </div>
          <button
            disabled={!canSubmit}
            onClick={onSubmit}
            className="mt-2 w-full rounded-xl border border-gold-light/40 py-2.5 text-sm text-paper transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            送出追問，抽一張牌
          </button>
        </div>
      )}
    </div>
  );
}

export default function TarotDivination() {
  const [step, setStep] = useState<Step>("cover");
  const [spreadSize, setSpreadSize] = useState<SpreadSize>(1);
  const [readingDate, setReadingDate] = useState("");
  const [question, setQuestion] = useState("");
  const [topicId, setTopicId] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [readingPositions, setReadingPositions] = useState<string[]>([]);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideCard, setGuideCard] = useState<TarotCard | null>(null);
  const [styles, setStyles] = useState<ReadingStyle[]>([]);
  const [coupleMode, setCoupleMode] = useState(false);
  const [selfGender, setSelfGender] = useState("");
  const [partnerGender, setPartnerGender] = useState("");
  const [selfName, setSelfName] = useState("");
  const [selfBirthDate, setSelfBirthDate] = useState("");
  const [selfBirthTime, setSelfBirthTime] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthDate, setPartnerBirthDate] = useState("");
  const [shuffleTick, setShuffleTick] = useState(0);
  const [pickedSlots, setPickedSlots] = useState<number[]>([]);
  const [results, setResults] = useState<CardDraw[]>([]);
  const [reading, setReading] = useState<ReadingReport | null>(null);
  const [readingError, setReadingError] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUpEntry[]>([]);
  const [followUpDraft, setFollowUpDraft] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpCandidates, setFollowUpCandidates] = useState<CardDraw[] | null>(null);
  const [followUpPickedIndex, setFollowUpPickedIndex] = useState<number | null>(null);

  const [history, setHistory] = useState<SavedReading[]>([]);
  const [storageNotice, setStorageNotice] = useState("");
  const [exportBusy, setExportBusy] = useState(false);
  const [exportUrl, setExportUrl] = useState("");
  const [exportError, setExportError] = useState("");
  const activeReportId = useRef("");
  const createdAt = useRef("");
  const requestVersion = useRef(0);
  const followUpBusy = useRef(false);
  const exportVersion = useRef(0);

  useEffect(() => () => { if (exportUrl) URL.revokeObjectURL(exportUrl); }, [exportUrl]);

  function snapshot(report: ReadingReport, draws: CardDraw[], entries: FollowUpEntry[]): SavedReading {
    if (!activeReportId.current) activeReportId.current = crypto.randomUUID();
    if (!createdAt.current) createdAt.current = new Date().toISOString();
    return {
      id: activeReportId.current, createdAt: createdAt.current, date: readingDate,
      question, spreadSize, positions: readingPositions, styles, coupleMode,
      birthInfo: {
        self: { name: selfName.trim(), gender: selfGender, date: selfBirthDate, time: selfBirthTime },
        partner: coupleMode ? { name: partnerName.trim(), gender: partnerGender, date: partnerBirthDate } : undefined,
      },
      results: draws, reading: report, followUps: entries,
    };
  }
  function persist(report: ReadingReport, draws: CardDraw[], entries: FollowUpEntry[]) {
    try {
      saveReading(snapshot(report, draws, entries));
      setStorageNotice("已儲存至此瀏覽器的占卜紀錄");
    } catch {
      setStorageNotice("紀錄未能儲存，可能是瀏覽器儲存空間不足或禁止儲存。請先下載 JPG 報告備份。");
    }
  }
  function showHistory() {
    try { setHistory(loadHistory()); setStorageNotice(""); }
    catch { setHistory([]); setStorageNotice("無法讀取此瀏覽器的紀錄，原始資料尚未刪除。"); }
    setStep("history");
  }
  function openHistory(entry: SavedReading) {
    resetAll();
    activeReportId.current = entry.id;
    createdAt.current = entry.createdAt;
    setReadingDate(entry.date); setQuestion(entry.question); setSpreadSize(entry.spreadSize); setReadingPositions(entry.positions);
    setStyles(entry.styles); setCoupleMode(entry.coupleMode);
    setSelfName(entry.birthInfo.self.name || ""); setSelfGender(entry.birthInfo.self.gender || "");
    setSelfBirthDate(entry.birthInfo.self.date || ""); setSelfBirthTime(entry.birthInfo.self.time || "");
    setPartnerName(entry.birthInfo.partner?.name || ""); setPartnerGender(entry.birthInfo.partner?.gender || "");
    setPartnerBirthDate(entry.birthInfo.partner?.date || "");
    setResults(entry.results); setReading(entry.reading); setFollowUps(entry.followUps);
    setStorageNotice("正在閱讀已儲存的占卜紀錄"); setStep("reveal");
  }
  function removeHistory(id: string) {
    if (!window.confirm("確定刪除這筆占卜紀錄？此操作無法復原，建議先下載 JPG 備份。")) return;
    try { setHistory(deleteReading(id)); }
    catch { setStorageNotice("刪除失敗，請稍後重試。"); }
  }
  async function exportReport() {
    if (!reading || exportBusy) return;
    const version = ++exportVersion.current;
    setExportBusy(true); setExportError(""); setExportUrl("");
    try {
      const { createReportJpg } = await import("@/lib/tarot/reportImage");
      const blob = await createReportJpg(snapshot(reading, results, followUps));
      if (version === exportVersion.current) setExportUrl(URL.createObjectURL(blob));
    } catch (error) {
      if (version === exportVersion.current) setExportError(error instanceof Error ? error.message : "圖片製作失敗，請重試");
    } finally { if (version === exportVersion.current) setExportBusy(false); }
  }

  const selectedTopic = TOPIC_OPTIONS.find((topic) => topic.id === topicId);
  const activePositionLabels: readonly string[] = readingPositions.length === spreadSize ? readingPositions : defaultPositionLabels(spreadSize);
  const canDraw = Boolean(selectedTopic) && (spreadSize === 5 || selectedQuestions.length === spreadSize);
  function selectTopic(id: string) {
    setTopicId(id);
    setSelectedQuestions([]);
  }
  function toggleQuestion(value: string) {
    setSelectedQuestions((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : current.length < spreadSize ? [...current, value] : current);
  }
  function startReading() {
    if (!canDraw || !selectedTopic) return;
    const positions = spreadSize === 5 ? [...selectedTopic.questions] : selectedQuestions;
    const composed = [`占卜主題：${selectedTopic.label}`, "想問的題目：", ...positions.map((item, index) => `${index + 1}. ${item}`), question.trim() ? `補充說明：${question.trim()}` : "補充說明：未填"].join("\n");
    setQuestion(composed); setReadingPositions(positions);
    setReadingDate(new Date().toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", "."));
    setStep("shuffle");
  }

  const birthInfo: BirthInfo | undefined = selfName.trim() || selfGender || selfBirthDate || (coupleMode && (partnerName.trim() || partnerGender || partnerBirthDate))
    ? {
        self: { name: selfName.trim() || undefined, gender: selfGender || undefined, date: selfBirthDate, time: selfBirthTime || undefined },
        partner: coupleMode ? { name: partnerName.trim() || undefined, gender: partnerGender || undefined, date: partnerBirthDate } : undefined,
      }
    : undefined;

  const spread = useMemo(() => {
    const rand = mulberry32(101);
    return Array.from({ length: SPREAD_COUNT }, (_, i) => {
      const mid = (SPREAD_COUNT - 1) / 2;
      const offset = i - mid;
      return {
        id: i,
        rotate: offset * 6 + (rand() - 0.5) * 2,
        translateY: Math.abs(offset) * 6,
      };
    });
  }, []);

  useEffect(() => {
    if (step !== "shuffle") return;
    const ticker = setInterval(() => setShuffleTick((t) => t + 1), 180);
    const timeout = setTimeout(() => setStep("spread"), 1620);
    return () => {
      clearInterval(ticker);
      clearTimeout(timeout);
    };
  }, [step]);

  function toggleStyle(id: ReadingStyle) {
    setStyles((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function handlePickCard(slotId: number) {
    if (pickedSlots.includes(slotId) || pickedSlots.length >= spreadSize) return;
    const version = requestVersion.current;
    const nextPicked = [...pickedSlots, slotId];
    setPickedSlots(nextPicked);
    if (nextPicked.length === spreadSize) {
      const draws = drawUniqueCards(spreadSize);
      setResults(draws);
      setReadingError("");
      setStep("analyzing");
      try {
        const nextReading = await requestAiReading(draws, question, styles, undefined, birthInfo, readingPositions);
        if (version !== requestVersion.current) return;
        setReading(nextReading);
        persist(nextReading, draws, []);
        setStep("reveal");
      } catch (error) {
        if (version !== requestVersion.current) return;
        setReadingError(error instanceof Error ? error.message : "解牌服務暫時無法使用");
      }
    }
  }

  async function retryReading() {
    if (!results.length) return;
    const version = requestVersion.current;
    setReadingError("");
    try {
      const nextReading = await requestAiReading(results, question, styles, undefined, birthInfo, readingPositions);
      if (version !== requestVersion.current) return;
      setReading(nextReading);
      persist(nextReading, results, []);
      setStep("reveal");
    } catch (error) {
      if (version !== requestVersion.current) return;
      setReadingError(error instanceof Error ? error.message : "解牌服務暫時無法使用");
    }
  }

  function resetAll() {
    requestVersion.current++; exportVersion.current++; followUpBusy.current = false;
    activeReportId.current = ""; createdAt.current = "";
    setExportUrl(""); setExportError(""); setExportBusy(false); setStorageNotice(""); setFollowUpLoading(false);
    setQuestion(""); setTopicId(""); setSelectedQuestions([]); setReadingPositions([]);
    setStyles([]);
    setResults([]);
    setReading(null);
    setReadingError("");
    setPickedSlots([]);
    setFollowUps([]);
    setFollowUpDraft("");
    setFollowUpQuestion("");
    setFollowUpCandidates(null);
    setFollowUpPickedIndex(null);
    setStep("cover");
  }

  function handleSubmitFollowUp() {
    if (followUpDraft.trim().length < 10 || followUps.length >= FOLLOW_UP_LIMIT || followUpBusy.current || followUpCandidates) return;
    try {
      const saved = loadHistory().find((entry) => entry.id === activeReportId.current);
      if (saved && saved.followUps.length > followUps.length) { openHistory(saved); return; }
    } catch { /* Allow the current unsaved report to remain usable. */ }
    setReadingError("");
    const usedIds = new Set([...results.map((r) => r.card.id), ...followUps.map((f) => f.card.card.id)]);
    const candidates: CardDraw[] = [];
    let guard = 0;
    while (candidates.length < 3 && guard < 100) {
      guard++;
      const [draw] = drawUniqueCards(1);
      if (usedIds.has(draw.card.id) || candidates.some((c) => c.card.id === draw.card.id)) continue;
      candidates.push(draw);
    }
    setFollowUpQuestion(followUpDraft.trim());
    setFollowUpCandidates(candidates);
    setFollowUpPickedIndex(null);
    setFollowUpDraft("");
  }

  async function handlePickFollowUpCard(index: number) {
    if (followUpPickedIndex !== null || !followUpCandidates || followUpBusy.current || followUps.length >= FOLLOW_UP_LIMIT) return;
    const version = requestVersion.current;
    followUpBusy.current = true;
    setFollowUpPickedIndex(index);
    setFollowUpLoading(true);
    const drawnCard = followUpCandidates[index];
    try {
      const report = await requestAiReading([drawnCard], question, styles, followUpQuestion, birthInfo);
      if (version !== requestVersion.current) return;
      const answer = [...report.paragraphs, `總結｜${report.summary}`].join("\n\n");
      const entries = [...followUps, { question: followUpQuestion, answer, card: drawnCard }];
      setFollowUps(entries);
      exportVersion.current++; setExportBusy(false);
      if (reading) persist(reading, results, entries);
      setExportUrl("");
      setFollowUpCandidates(null);
      setFollowUpPickedIndex(null);
      setFollowUpQuestion("");
    } catch (error) {
      if (version !== requestVersion.current) return;
      setFollowUpDraft(followUpQuestion);
      setReadingError(error instanceof Error ? error.message : "追問服務暫時無法使用");
      setFollowUpCandidates(null);
      setFollowUpPickedIndex(null);
    } finally {
      if (version === requestVersion.current) { followUpBusy.current = false; setFollowUpLoading(false); }
    }
  }


  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-5 py-16 text-center text-paper">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_118px] items-center gap-3 rounded-[2rem] bg-paper/[0.04] px-5 py-5 text-left">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-gold-light/70">TAROT READING</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[0.18em]">塔羅占卜</h1>
          <p className="mt-2 text-xs leading-5 text-gold-light/70">{SPREAD_MODES.find((m) => m.id === spreadSize)?.hint}</p>
        </div>
        <div className="animate-float-slow relative h-36 w-full">
          <Image src={asset("/images/tarot-reader-cutout.webp")} alt="小艾進行塔羅占卜" fill className="object-contain" sizes="118px" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-gold-light/20 bg-paper/5 p-1">
          {SPREAD_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setSpreadSize(mode.id); setSelectedQuestions([]); }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                spreadSize === mode.id ? "bg-gold-light text-[#0b0f2e]" : "text-gold-light/70 hover:text-paper"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => { setGuideCard(null); setGuideOpen(true); }} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-light/30 bg-paper/5 text-xs font-semibold text-paper" aria-label="開啟塔羅牌介紹">牌義</button>
      </div>

      {guideOpen && <TarotGuideModal selectedCard={guideCard} onSelect={setGuideCard} onClose={() => { setGuideOpen(false); setGuideCard(null); }} />}

      <div className="w-full space-y-2">
        <button onClick={showHistory} className="w-full rounded-xl border border-gold-light/30 py-3 text-sm text-paper">我的占卜紀錄</button>
        <p className="text-[11px] leading-5 text-gold-light/55">紀錄儲存在此裝置的瀏覽器，清除瀏覽資料後會消失，不會跨裝置同步。可下載 JPG 留存。</p>
      </div>

      <button
        onClick={() => setStep("form")}
        className="group relative h-56 w-36 cursor-pointer transition-transform duration-300 hover:-translate-y-2"
        aria-label="點擊卡牌開始"
      >
        <CardBack className="h-full w-full" />
      </button>
      <p className="animate-pulse text-sm text-gold-light/70">點擊卡牌開始</p>

      {step !== "cover" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8" onClick={resetAll}>
          <div className="relative h-full max-h-[85svh] w-full max-w-[430px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={resetAll}
              aria-label="關閉塔羅占卜視窗"
              className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold-light text-xl font-bold text-[#0b0f2e] shadow-soft transition hover:bg-paper"
            >
              ✕
            </button>
            <div className="flex h-full w-full flex-col overflow-y-auto rounded-[1.5rem] border border-gold-light/30 bg-night-dark p-5 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {step === "history" && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-paper">我的占卜紀錄</h2>
          <p className="text-xs leading-6 text-gold-light/60">點選紀錄可回顧牌面、解讀與追問，並下載 JPG。紀錄只保留在此瀏覽器。</p>
          {storageNotice && <p role="status" className="text-sm text-paper">{storageNotice}</p>}
          {!history.length && !storageNotice && <p className="py-12 text-center text-sm text-gold-light/70">還沒有占卜紀錄。完成第一次解牌後，報告會自動保存在這裡。</p>}
          {history.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-gold-light/20 bg-paper/5 p-4">
              <button onClick={() => openHistory(entry)} className="w-full text-left">
                <p className="text-xs text-gold-light/60">{entry.date} · {entry.spreadSize} 題 · 追問 {entry.followUps.length}/5</p>
                <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-paper">{entry.question}</p>
                <span className="mt-3 block text-xs text-gold-light">開啟完整報告 →</span>
              </button>
              <button onClick={() => removeHistory(entry.id)} className="mt-3 text-xs text-blush/80" aria-label={`刪除 ${entry.date} 的占卜紀錄`}>刪除紀錄</button>
            </div>
          ))}
        </section>
      )}

      {step === "form" && (
        <div className="flex flex-1 flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold">你想問些什麼？</h2>
            <p className="mt-1 text-xs text-gold-light/60">寫得越具體，解讀越貼近你的處境。</p>
          </div>
          <section className="space-y-4 rounded-xl border border-gold-light/20 bg-paper/5 p-3">
            <div>
              <label htmlFor="tarot-topic" className="mb-2 block text-xs font-semibold text-paper">1. 選擇占卜主題</label>
              <select id="tarot-topic" value={topicId} onChange={(event) => selectTopic(event.target.value)} className="w-full rounded-lg border border-gold-light/30 bg-night-dark px-3 py-2.5 text-sm text-paper">
                <option value="">請選擇主題</option>
                {TOPIC_OPTIONS.map((topic) => <option key={topic.id} value={topic.id}>{topic.label}</option>)}
              </select>
            </div>
            {selectedTopic && <div>
              <div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-paper">2. 占卜題目</span><span className="text-gold-light/60">{spreadSize === 5 ? "本次解讀全部 5 題" : `已選 ${selectedQuestions.length}/${spreadSize}`}</span></div>
              <div className="space-y-2">
                {selectedTopic.questions.map((item, index) => {
                  if (spreadSize === 5) return <p key={item} className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-xs leading-5 text-paper">{index + 1}. {item}</p>;
                  const checked = selectedQuestions.includes(item);
                  const disabled = !checked && selectedQuestions.length >= spreadSize;
                  return <label key={item} className={`flex items-start gap-3 rounded-lg border p-3 text-xs leading-5 ${checked ? "border-gold bg-gold/10 text-paper" : "border-gold-light/15 text-gold-light/75"} ${disabled ? "opacity-40" : "cursor-pointer"}`}>
                    <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleQuestion(item)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
                    <span>{index + 1}. {item}</span>
                  </label>;
                })}
              </div>
            </div>}
            <div>
              <label htmlFor="tarot-note" className="mb-2 block text-xs font-semibold text-paper">3. 補充說明（選填）</label>
              <textarea id="tarot-note" value={question} maxLength={2000} onChange={(e) => setQuestion(e.target.value)} placeholder="例如：認識多久、目前互動、遇到的狀況，以及你最在意的部分⋯" className="h-32 w-full resize-none rounded-xl border border-gold-light/30 bg-paper/5 p-3 text-sm text-paper placeholder:text-gold-light/40 focus:border-gold-light/70 focus:outline-none" />
              <div className="mt-1 flex justify-between text-[11px] text-gold-light/50"><span>請勿填寫電話、地址等敏感資料</span><span>{question.length}/2000</span></div>
            </div>
            <p className="rounded-lg bg-black/15 p-3 text-[11px] leading-5 text-gold-light/60">說明：選擇單題時請勾選 1 題，選擇三題時請勾選 3 題；五題會自動解讀全部題目。每個問題對應一張牌。補充實際背景能讓解讀更貼近你的情況；不方便說明也可以留白。</p>
          </section>

          <div className="rounded-xl border border-gold-light/20 bg-paper/5 p-3">
              <p className="text-xs text-gold-light/80">如果想要更精準解牌，請幫我填寫基本資料（選填）</p>
              <div className="mt-3 space-y-3">
                <p className="text-[11px] text-gold-light/50">請用暱稱或代號，勿填真實敏感資料</p>
                <div className="flex gap-2 rounded-full border border-gold-light/20 bg-black/10 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setCoupleMode(false)}
                    className={`flex-1 rounded-full py-1.5 transition-colors ${
                      !coupleMode ? "bg-gold-light text-[#0b0f2e]" : "text-gold-light/70"
                    }`}
                  >
                    只問自己
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoupleMode(true)}
                    className={`flex-1 rounded-full py-1.5 transition-colors ${
                      coupleMode ? "bg-gold-light text-[#0b0f2e]" : "text-gold-light/70"
                    }`}
                  >
                    雙方合問
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-gold-light/60">{coupleMode ? "你的資訊" : "你的出生資訊"}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      aria-label="你的姓名（選填）"
                      value={selfName}
                      onChange={(e) => setSelfName(e.target.value)}
                      placeholder="姓名（選填）"
                      className="min-w-0 w-full rounded-lg border border-gold-light/30 bg-paper/5 px-3 py-2 text-xs text-paper placeholder:text-gold-light/40 focus:border-gold-light/70 focus:outline-none"
                    />
                    <input
                      type="date"
                      aria-label="你的出生日期（選填）"
                      value={selfBirthDate}
                      onChange={(e) => setSelfBirthDate(e.target.value)}
                      className="min-w-0 w-full rounded-lg border border-gold-light/30 bg-paper/5 px-3 py-2 text-xs text-paper [color-scheme:dark] focus:border-gold-light/70 focus:outline-none"
                    />
                  </div>
                  <select aria-label="你的性別（選填）" value={selfGender} onChange={(e) => setSelfGender(e.target.value)} className="w-full rounded-lg border border-gold-light/30 bg-night-dark px-3 py-2 text-xs text-paper">
                    <option value="">性別（選填）</option>
                    <option value="女">女</option>
                    <option value="男">男</option>
                    <option value="其他">其他</option>
                    <option value="不透露">不透露</option>
                  </select>
                  <input
                    type="time"
                    aria-label="你的出生時間（選填）"
                    value={selfBirthTime}
                    onChange={(e) => setSelfBirthTime(e.target.value)}
                    className="w-full rounded-lg border border-gold-light/30 bg-paper/5 px-3 py-2 text-xs text-paper [color-scheme:dark] focus:border-gold-light/70 focus:outline-none"
                  />
                  <p className="text-[10px] text-gold-light/40">姓名、出生日期與時間都可不填，不確定可留白</p>
                </div>

                {coupleMode && (
                  <div className="space-y-2 border-t border-gold-light/10 pt-3">
                    <p className="text-[11px] text-gold-light/60">對方資訊（不需要時辰）</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        aria-label="對方姓名（選填）"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="姓名（選填）"
                        className="min-w-0 w-full rounded-lg border border-gold-light/30 bg-paper/5 px-3 py-2 text-xs text-paper placeholder:text-gold-light/40 focus:border-gold-light/70 focus:outline-none"
                      />
                      <input
                        type="date"
                        aria-label="對方出生日期（選填）"
                        value={partnerBirthDate}
                        onChange={(e) => setPartnerBirthDate(e.target.value)}
                        className="min-w-0 w-full rounded-lg border border-gold-light/30 bg-paper/5 px-3 py-2 text-xs text-paper [color-scheme:dark] focus:border-gold-light/70 focus:outline-none"
                      />
                    </div>
                  <select aria-label="對方性別（選填）" value={partnerGender} onChange={(e) => setPartnerGender(e.target.value)} className="w-full rounded-lg border border-gold-light/30 bg-night-dark px-3 py-2 text-xs text-paper">
                    <option value="">性別（選填）</option>
                    <option value="女">女</option>
                    <option value="男">男</option>
                    <option value="其他">其他</option>
                    <option value="不透露">不透露</option>
                  </select>
                  </div>
                )}
              </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((opt) => {
              const active = styles.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleStyle(opt.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs transition-colors ${
                    active
                      ? "border-gold bg-gold/10 text-paper"
                      : "border-gold-light/20 text-gold-light/70 hover:border-gold-light/40"
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span>
                    {opt.label}
                    {opt.badge && <span className="ml-1 rounded bg-gold-light/20 px-1 text-[9px]">{opt.badge}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            disabled={!canDraw}
            onClick={startReading}
            className="mt-auto w-full rounded-xl bg-gold-light py-3 text-sm font-semibold text-[#0b0f2e] transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            開始洗牌
          </button>
        </div>
      )}

      {step === "shuffle" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <p className="text-sm text-gold-light/70">牌正在為你重新排列⋯</p>
          <div className="relative h-56 w-36">
            {Array.from({ length: 7 }, (_, i) => {
              const rand = mulberry32(i * 13 + shuffleTick);
              const x = (rand() - 0.5) * 90;
              const y = (rand() - 0.5) * 40;
              const r = (rand() - 0.5) * 50;
              return (
                <div
                  key={i}
                  className="absolute inset-0 transition-transform duration-150 ease-out"
                  style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}
                >
                  <CardBack className="h-full w-full" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === "spread" && (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-1.5">
          <p className="text-xs text-gold-light/70">
            {spreadSize === 1
              ? "憑直覺，選一張牌"
              : `憑直覺依序選 ${spreadSize} 張牌 · 目前選第 ${Math.min(pickedSlots.length + 1, spreadSize)} 張：${
                  activePositionLabels[pickedSlots.length] ?? ""
                }`}
          </p>
          <p className="text-[10px] text-gold-light/40">↕ 上下滑動查看全部的牌</p>
          <div className="relative -mx-5 -mb-5 w-[calc(100%+2.5rem)] min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white/95 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="relative flex flex-col gap-[2px]">
              <div className="pointer-events-none absolute inset-y-0 left-[32%] border-l-2 border-dotted border-gold-dark/80" />
              <div className="pointer-events-none absolute inset-y-0 left-[68%] border-l-2 border-dotted border-gold-dark/80" />
              {spread.map((c, i) => {
                const pickedIndex = pickedSlots.indexOf(c.id);
                const isPicked = pickedIndex !== -1;
                const isLast = i === spread.length - 1;
                if (isLast) {
                  return (
                    <button
                      key={c.id}
                      onClick={() => handlePickCard(c.id)}
                      disabled={isPicked || pickedSlots.length >= spreadSize}
                      aria-label={`選擇第 ${c.id + 1} 張牌`}
                      className={`relative h-24 w-full shrink-0 overflow-hidden rounded-[2px] transition-opacity disabled:cursor-default ${
                        isPicked ? "opacity-35" : ""
                      }`}
                    >
                      <CardBack className="h-full w-full rounded-none border-0" />
                      {isPicked && (
                        <span className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-night-dark text-xs font-bold text-gold-light ring-2 ring-gold-light">
                          {pickedIndex + 1}
                        </span>
                      )}
                    </button>
                  );
                }
                return (
                  <button
                    key={c.id}
                    onClick={() => handlePickCard(c.id)}
                    disabled={isPicked || pickedSlots.length >= spreadSize}
                    aria-label={`選擇第 ${c.id + 1} 張牌`}
                    className={`relative h-3 w-full shrink-0 rounded-[1px] bg-[#1a35a8] transition-colors enabled:hover:bg-[#2b48c9] disabled:cursor-default ${
                      isPicked ? "bg-gold-dark" : ""
                    }`}
                  >
                    {isPicked && (
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-bold leading-none text-[#0b0f2e]">
                        {pickedIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="animate-pulse text-4xl">🔮</div>
          {!readingError ? (
            <p className="animate-pulse text-sm text-gold-light/70">牌陣已經排好，正在針對你的問題解讀⋯</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-blush">{readingError}</p>
              <button onClick={retryReading} className="rounded-xl border border-gold-light/40 px-5 py-2 text-sm text-paper">
                重新解牌
              </button>
            </div>
          )}
        </div>
      )}

      {step === "reveal" && reading && results.length === spreadSize && (
        <div className="flex flex-1 flex-col gap-5 py-2">
          <header className="w-full rounded-xl border border-gold-light/20 bg-paper/5 p-4">
            <h2 className="text-lg font-semibold text-paper">艾飛樂語錄｜個人線上塔羅占卜</h2>
            <h3 className="mt-4 font-semibold text-paper">個案基本資料</h3>
            <div className="mt-3 space-y-1 break-words text-xs leading-6 text-paper/80">
              <div>占卜日期：{readingDate}</div>
              <div>個案姓名：{selfName.trim() || "未填"}{selfGender ? `（${selfGender}）` : ""}</div>
              <div>出生年月日：{selfBirthDate.replaceAll("-", ".") || "未填"}</div>
              <div>出生時間：{selfBirthTime || "未知"}</div>
              {coupleMode && <><div>對方姓名：{partnerName.trim() || "未填"}{partnerGender ? `（${partnerGender}）` : ""}</div><div>對方出生年月日：{partnerBirthDate.replaceAll("-", ".") || "未填"}</div></>}
            </div>
            <h3 className="mt-4 text-xs text-gold-light/60">遇到的問題（越詳細越準唷）：</h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">{question}</p>
          </header>

          <div className="space-y-3 rounded-xl border border-gold-light/30 bg-gold-light/5 p-4">
            <p className="text-xs leading-5 text-gold-light/70">{storageNotice}</p>
            <button onClick={exportReport} disabled={exportBusy || followUpLoading} className="w-full rounded-xl bg-gold-light py-3 text-sm font-semibold text-[#0b0f2e] disabled:opacity-50">{exportBusy ? "正在設計報告圖片⋯" : "製作 JPG 報告"}</button>
            <p className="text-[11px] leading-5 text-gold-light/60">含個人資料、完整牌面與解讀，以及已完成的追問。</p>
            {exportUrl && <div className="space-y-3 text-sm text-paper">
              <a href={exportUrl} download={`艾飛樂塔羅報告-${readingDate.replaceAll(".", "-")}.jpg`} className="block rounded-lg border border-gold-light/40 py-2 text-center">下載 JPG</a>
              <details className="rounded-lg border border-gold-light/30 p-3">
                <summary className="cursor-pointer">預覽 JPG 報告</summary>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={exportUrl} alt="完整塔羅報告 JPG 預覽" className="mt-3 h-auto w-full rounded" />
              </details>
            </div>}
            {exportError && <p role="alert" className="text-sm text-blush">{exportError}</p>}
          </div>

          <h3 className="text-lg font-semibold text-paper">個性分析</h3>
          {reading.personality && (
            <section className="rounded-xl border border-gold-light/20 bg-paper/5 p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-paper/90">{reading.personality}</p>
            </section>
          )}

          <section className="border-y border-gold-light/30 py-5">
            <div className={`grid gap-3 ${results.length === 1 ? "grid-cols-1" : "grid-cols-6"}`}>
              {results.map((draw, index) => (
                <div key={`overview-${draw.card.id}`} className={`text-center ${results.length === 1 ? "" : `col-span-2 ${results.length === 5 && index === 3 ? "col-start-2" : ""}`}`}>
                  <div className={`relative mx-auto ${results.length === 1 ? "h-64 w-40" : "aspect-[2/3] w-full max-w-28"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(draw.card.image!)} alt={`${draw.card.name}${draw.isReversed ? "逆位" : "正位"}`} className={`h-full w-full object-contain ${draw.isReversed ? "rotate-180" : ""}`} />
                  </div>
                  <p className="mt-2 text-[11px] font-semibold leading-5 text-paper">{draw.card.name}<br />（{draw.isReversed ? "逆位" : "正位"}）</p>
                </div>
              ))}
            </div>
          </section>

          <h3 className="text-lg font-semibold text-paper">解牌</h3>

          {results.map((draw, index) => (
            <ReadingCard key={draw.card.id} draw={draw} label={activePositionLabels[index]}>
              <p>{reading.paragraphs[index]}</p>
            </ReadingCard>
          ))}

          <section className="rounded-xl border border-gold-light/30 bg-gold-light/5 p-4">
            <h3 className="mb-3 font-semibold text-paper">總結與建議</h3>
            <p className="whitespace-pre-line text-sm leading-7 text-paper/90">{reading.summary}</p>
          </section>
          {readingError && <p role="alert" className="text-sm text-blush">{readingError}</p>}
          <FollowUpPanel
            followUps={followUps}
            draft={followUpDraft}
            onDraftChange={setFollowUpDraft}
            onSubmit={handleSubmitFollowUp}
            candidates={followUpCandidates}
            pickedIndex={followUpPickedIndex}
            onPickCandidate={handlePickFollowUpCard}
            loading={followUpLoading}
          />
          <div className="mt-auto flex w-full gap-2 pt-2">
            <button onClick={resetAll} className="flex-1 rounded-xl border border-gold-light/40 py-3 text-sm text-paper">再抽一次</button>
            <Link href="/" className="flex-1 rounded-xl bg-gold-light py-3 text-center text-sm font-semibold text-[#0b0f2e]">回首頁</Link>
          </div>
        </div>
      )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
