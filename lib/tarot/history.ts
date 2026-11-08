import { CardDraw, FULL_DECK } from "./cards";
import { BirthInfo } from "./ai";
import { ReadingReport, ReadingStyle } from "./reading";

export const FOLLOW_UP_LIMIT = 5;
const HISTORY_KEY = "aifeiler.tarot.history.v1";
export type FollowUpEntry = { question: string; answer: string; card: CardDraw };
export type SavedReading = {
  id: string;
  date: string;
  createdAt: string;
  question: string;
  spreadSize: 1 | 3 | 5;
  positions: string[];
  styles: ReadingStyle[];
  birthInfo: BirthInfo;
  coupleMode: boolean;
  results: CardDraw[];
  reading: ReadingReport;
  followUps: FollowUpEntry[];
};

type PackedDraw = { id: number; reversed: boolean };
type PackedReading = Omit<SavedReading, "results" | "followUps"> & {
  results: PackedDraw[];
  followUps: (Omit<FollowUpEntry, "card"> & { card: PackedDraw })[];
};
const packDraw = (draw: CardDraw): PackedDraw => ({ id: draw.card.id, reversed: draw.isReversed });
function unpackDraw(draw: PackedDraw): CardDraw {
  const card = FULL_DECK.find((card) => card.id === draw.id);
  if (!card || typeof draw.reversed !== "boolean") throw new Error("紀錄中的牌面資料不完整");
  return { card, isReversed: draw.reversed };
}

export function loadHistory(): SavedReading[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  const data = JSON.parse(raw) as PackedReading[];
  if (!Array.isArray(data)) throw new Error("紀錄格式無法讀取");
  return data.map((entry) => {
    if (!entry || typeof entry.id !== "string" || typeof entry.date !== "string" || typeof entry.createdAt !== "string" || typeof entry.question !== "string" || ![1, 3, 5].includes(entry.spreadSize) || (entry.positions !== undefined && (!Array.isArray(entry.positions) || entry.positions.length !== entry.spreadSize || !entry.positions.every((p) => typeof p === "string"))) || !Array.isArray(entry.results) || entry.results.length !== entry.spreadSize || !Array.isArray(entry.styles) || !entry.birthInfo?.self || typeof entry.birthInfo.self.date !== "string" || !entry.reading || typeof entry.reading.title !== "string" || typeof entry.reading.summary !== "string" || !Array.isArray(entry.reading.paragraphs) || entry.reading.paragraphs.length !== entry.spreadSize || !entry.reading.paragraphs.every((p) => typeof p === "string") || !Array.isArray(entry.followUps) || entry.followUps.length > FOLLOW_UP_LIMIT) {
      throw new Error("紀錄格式無法讀取，原始紀錄仍保留在此瀏覽器");
    }
    return {
      ...entry,
      positions: entry.positions || (entry.spreadSize === 5 ? ["目前關係能量高低", "未來三個月感情運勢", "對方對你的看法", "對方對這段關係的想法", "目前阻礙和關鍵點"] : entry.spreadSize === 3 ? ["過去", "現在", "未來"] : ["核心訊息"]),
      results: entry.results.map(unpackDraw),
      followUps: entry.followUps.map((followUp) => {
        if (typeof followUp.question !== "string" || typeof followUp.answer !== "string") throw new Error("追問紀錄格式無法讀取");
        return { ...followUp, card: unpackDraw(followUp.card) };
      }),
    };
  });
}

function writeHistory(entries: SavedReading[]) {
  const packed: PackedReading[] = entries.map((entry) => ({
    ...entry,
    results: entry.results.map(packDraw),
    followUps: entry.followUps.map((followUp) => ({ ...followUp, card: packDraw(followUp.card) })),
  }));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(packed));
}

export function saveReading(entry: SavedReading) {
  // Read at the time of writing to preserve records created in another tab.
  const entries = loadHistory();
  const existing = entries.find((item) => item.id === entry.id);
  if (existing && existing.followUps.length > entry.followUps.length) throw new Error("此紀錄已在其他分頁更新，請從歷史紀錄重新開啟");
  writeHistory([entry, ...entries.filter((item) => item.id !== entry.id)]);
}

export function deleteReading(id: string): SavedReading[] {
  const entries = loadHistory().filter((entry) => entry.id !== id);
  writeHistory(entries);
  return entries;
}
