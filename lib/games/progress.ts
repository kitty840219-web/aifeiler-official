"use client";

import { useSyncExternalStore } from "react";

export type Flower = { id: string; kind: string; mood: string; day: string };
export type Progress = { stars: number; memoryBest: number; catchBest: number; flowers: Flower[]; lastGardenDay: string; decoration: string };
const KEY = "aifeiler-games-v1";
const EVENT = "aifeiler-games-change";
const empty: Progress = { stars: 0, memoryBest: 0, catchBest: 0, flowers: [], lastGardenDay: "", decoration: "moon" };
let memory: Progress = empty;

function number(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0; }
function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return memory;
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object") return empty;
    return { stars: number(p.stars), memoryBest: number(p.memoryBest), catchBest: number(p.catchBest), lastGardenDay: typeof p.lastGardenDay === "string" ? p.lastGardenDay : "", decoration: ["moon", "ribbon", "butterfly"].includes(p.decoration) ? p.decoration : "moon", flowers: Array.isArray(p.flowers) ? p.flowers.filter((f: Flower) => f && typeof f.id === "string" && ["daisy", "tulip", "sunflower"].includes(f.kind) && typeof f.day === "string" && typeof f.mood === "string").slice(-24) : [] };
  } catch { return memory; }
}

export function updateProgress(change: (p: Progress) => Progress) {
  memory = change(read());
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* Play remains available in this tab. */ }
  window.dispatchEvent(new Event(EVENT));
}

type Snapshot = { progress: Progress; ready: boolean; persistent: boolean };
const serverSnapshot: Snapshot = { progress: empty, ready: false, persistent: true };
let snapshot = serverSnapshot;

function refreshSnapshot() {
  let persistent = true;
  try { localStorage.setItem(KEY + "-probe", "1"); localStorage.removeItem(KEY + "-probe"); } catch { persistent = false; }
  snapshot = { progress: read(), ready: true, persistent };
}

function subscribe(notify: () => void) {
  const refresh = () => { refreshSnapshot(); notify(); };
  if (!snapshot.ready) refreshSnapshot();
  window.addEventListener(EVENT, refresh);
  window.addEventListener("storage", refresh);
  return () => { window.removeEventListener(EVENT, refresh); window.removeEventListener("storage", refresh); };
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
