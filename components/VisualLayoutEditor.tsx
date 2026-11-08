"use client";

import { useEffect, useMemo, useState } from "react";

type LayerState = { x: number; y: number; scale: number };
type Layer = { id: string; name: string };

const EMPTY: LayerState = { x: 0, y: 0, scale: 1 };

function storageKey(pathname: string) {
  return `aifeiler-layout:${pathname}`;
}

export default function VisualLayoutEditor({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selected, setSelected] = useState("");
  const [values, setValues] = useState<Record<string, LayerState>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") !== "1") return;
    const timer = window.setTimeout(() => {
      setEnabled(true);
      const found = Array.from(document.querySelectorAll<HTMLElement>("[data-layout-id]"))
        .map((node) => ({ id: node.dataset.layoutId || "", name: node.dataset.layoutName || "圖片" }))
        .filter((layer) => layer.id);
      setLayers(found);
      setSelected(found[0]?.id || "");
      try {
        setValues(JSON.parse(localStorage.getItem(storageKey(window.location.pathname)) || "{}"));
      } catch {
        setValues({});
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.querySelectorAll<HTMLElement>("[data-layout-id]").forEach((node) => {
      const current = values[node.dataset.layoutId || ""] || EMPTY;
      node.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${current.scale})`;
      node.style.transformOrigin = "center";
      node.style.touchAction = "none";
      node.style.outline = node.dataset.layoutId === selected ? "3px solid #e0ad47" : "1px dashed rgba(244,216,146,.55)";
      node.style.outlineOffset = "3px";
      node.style.cursor = "grab";
    });
    localStorage.setItem(storageKey(window.location.pathname), JSON.stringify(values));
  }, [enabled, selected, values]);

  useEffect(() => {
    if (!enabled) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-layout-id]"));
    const cleanups = nodes.map((node) => {
      let startX = 0;
      let startY = 0;
      let original = EMPTY;
      const down = (event: PointerEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const id = node.dataset.layoutId || "";
        setSelected(id);
        original = values[id] || EMPTY;
        startX = event.clientX;
        startY = event.clientY;
        node.setPointerCapture(event.pointerId);
      };
      const move = (event: PointerEvent) => {
        if (!node.hasPointerCapture(event.pointerId)) return;
        const id = node.dataset.layoutId || "";
        setValues((current) => ({
          ...current,
          [id]: { ...original, x: original.x + event.clientX - startX, y: original.y + event.clientY - startY },
        }));
      };
      node.addEventListener("pointerdown", down);
      node.addEventListener("pointermove", move);
      return () => {
        node.removeEventListener("pointerdown", down);
        node.removeEventListener("pointermove", move);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [enabled, values]);

  const current = useMemo(() => values[selected] || EMPTY, [selected, values]);
  const update = (change: Partial<LayerState>) => {
    if (!selected) return;
    setValues((all) => ({ ...all, [selected]: { ...(all[selected] || EMPTY), ...change } }));
  };
  const resetAll = () => {
    setValues({});
    localStorage.removeItem(storageKey(window.location.pathname));
  };

  return (
    <>
      {children}
      {enabled && (
        <aside className="fixed bottom-20 right-3 z-[100] w-56 rounded-2xl border border-gold/60 bg-night/95 p-3 text-paper shadow-2xl backdrop-blur sm:bottom-5 sm:right-5">
          <div className="mb-3 flex items-center justify-between">
            <strong className="text-sm text-gold-light">圖層調整</strong>
            <button type="button" onClick={() => { window.history.replaceState({}, "", window.location.pathname); setEnabled(false); }} className="rounded-lg px-2 py-1 text-xs text-paper/70">完成</button>
          </div>
          <div className="space-y-1">
            {layers.map((layer) => (
              <button key={layer.id} type="button" onClick={() => setSelected(layer.id)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${selected === layer.id ? "bg-gold text-night-dark" : "bg-white/5"}`}>
                {layer.name}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => update({ scale: Math.max(.35, current.scale - .1) })} className="rounded-lg border border-gold/40 py-2 text-sm">縮小 −</button>
            <button type="button" onClick={() => update({ scale: Math.min(2.5, current.scale + .1) })} className="rounded-lg border border-gold/40 py-2 text-sm">放大 ＋</button>
          </div>
          <button type="button" onClick={() => update(EMPTY)} className="mt-2 w-full rounded-lg bg-white/10 py-2 text-xs">還原這張圖</button>
          <button type="button" onClick={resetAll} className="mt-2 w-full py-1 text-xs text-paper/55">全部還原</button>
          <p className="mt-2 text-[12px] leading-5 text-paper/55">點選圖層後，直接拖曳圖片調整位置。</p>
        </aside>
      )}
    </>
  );
}
