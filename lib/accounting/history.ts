import type { AccountingToolId } from "./tools";

export type AccountingRecord = {
  id: string;
  tool: AccountingToolId;
  toolLabel: string;
  title: string;
  resultLabel: string;
  resultValue: string;
  date: string;
};

const HISTORY_KEY = "aifeiler.accounting.history.v1";
const HISTORY_LIMIT = 12;

export function loadAccountingHistory(): AccountingRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveAccountingRecord(record: Omit<AccountingRecord, "id" | "date">) {
  const entries = loadAccountingHistory();
  const entry: AccountingRecord = {
    ...record,
    id: `a${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
  };
  const next = [entry, ...entries].slice(0, HISTORY_LIMIT);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* private browsing can block storage */
  }
  return next;
}
