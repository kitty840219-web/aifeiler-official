import { TAROT_API_URL } from "../tarot/ai";
import { FortuneReport, FortuneCategory } from "./reading";
import { ZodiacSign } from "./signs";

export type AiCompatibility = {
  score: number;
  verdict: string;
  desc: string;
  attraction: string;
  challenge: string;
  advice: string;
};

async function post<T>(payload: object): Promise<T> {
  const response = await fetch(TAROT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "星座服務暫時無法使用");
  return data as T;
}

function cached<T>(key: string): T | null {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : null; } catch { return null; }
}

function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing can block storage. */ }
}

type DailyPayload = {
  overallScore: number; overview: string;
  loveScore: number; love: string; careerScore: number; career: string;
  wealthScore: number; wealth: string; healthScore: number; health: string;
  luckyColor: string; luckyNumber: number; luckyDirection: string; luckySign: string; advice: string;
};

export async function requestDailyFortune(sign: ZodiacSign, dateKey: string, dateDisplay: string): Promise<FortuneReport> {
  const key = `aifeiler-horoscope-daily-v1:${dateKey}:${sign.id}`;
  const saved = cached<FortuneReport>(key);
  if (saved) return saved;
  const data = await post<DailyPayload>({ type: "horoscope_daily", sign: sign.name, date: dateKey });
  const rows: [FortuneCategory, string, number, string][] = [
    ["love", "愛情", data.loveScore, data.love], ["career", "事業", data.careerScore, data.career],
    ["wealth", "財運", data.wealthScore, data.wealth], ["health", "健康", data.healthScore, data.health],
  ];
  const report: FortuneReport = { dateKey, dateDisplay, overallScore: data.overallScore, overallOpener: data.overview, categories: rows.map(([key, label, score, text]) => ({ key, label, score, text })), luckyColor: data.luckyColor, luckyNumber: data.luckyNumber, luckyDirection: data.luckyDirection, luckySign: data.luckySign, advice: data.advice, source: "gemini" };
  save(key, report);
  return report;
}

export async function requestCompatibility(sign: ZodiacSign, partner: ZodiacSign): Promise<AiCompatibility> {
  const ids = [sign.id, partner.id].sort().join("-");
  const key = `aifeiler-horoscope-match-v1:${ids}`;
  const saved = cached<AiCompatibility>(key);
  if (saved) return saved;
  const result = await post<AiCompatibility>({ type: "horoscope_match", sign: sign.name, partner: partner.name });
  save(key, result);
  return result;
}
