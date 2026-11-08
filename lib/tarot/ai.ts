import { CardDraw } from "./cards";
import { ReadingReport, ReadingStyle } from "./reading";

// Gemini 金鑰只會留在 Cloudflare Worker 的加密密鑰中，不會送到瀏覽器。
export const TAROT_API_URL = process.env.NEXT_PUBLIC_TAROT_API_URL || "https://claude.kitty840219.workers.dev";

export type BirthInfo = {
  self: { name?: string; gender?: string; date: string; time?: string };
  partner?: { name?: string; gender?: string; date: string };
};

const POSITION_LABELS = ["過去", "現在", "未來"];
export const RELATIONSHIP_POSITION_LABELS = ["目前關係能量高低", "未來三個月感情運勢", "對方對你的看法", "對方對這段關係的想法", "目前阻礙和關鍵點"];

function positionLabels(count: number) {
  if (count === 5) return RELATIONSHIP_POSITION_LABELS;
  if (count === 3) return POSITION_LABELS;
  return ["核心訊息"];
}

function payloadCards(draws: CardDraw[], customPositions?: string[]) {
  const labels = customPositions?.length === draws.length ? customPositions : positionLabels(draws.length);
  return draws.map((draw, index) => {
    const orientation = draw.isReversed ? draw.card.reversed : draw.card.upright;
    return {
      position: labels[index] ?? `第 ${index + 1} 張`,
      name: draw.card.name,
      isReversed: draw.isReversed,
      keywords: orientation.keywords,
      meaning: orientation.meaning,
    };
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postReading(body: string): Promise<ReadingReport> {
  const response = await fetch(TAROT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "解牌服務暫時無法使用");
  return data as ReadingReport;
}

export async function requestAiReading(
  draws: CardDraw[],
  question: string,
  styles: ReadingStyle[],
  followUp?: string,
  birthInfo?: BirthInfo,
  positions?: string[],
): Promise<ReadingReport> {
  const body = JSON.stringify({ question, followUp, styles, cards: payloadCards(draws, positions), birthInfo });
  try {
    return await postReading(body);
  } catch (error) {
    // A bare "Failed to fetch" is usually a transient network/cold-start hiccup, not a real
    // server error — retry once before surfacing it to the user.
    if (error instanceof TypeError) {
      await sleep(800);
      return await postReading(body);
    }
    throw error;
  }
}
