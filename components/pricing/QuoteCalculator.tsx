"use client";

import { useMemo, useState } from "react";
import { QUOTE_CATEGORIES, type QuoteItem } from "@/lib/data/quoteCalculator";
import { LINKS } from "@/lib/data/site";
import styles from "./QuoteCalculator.module.css";

const LINE_ID = LINKS.lineOA.split("@").pop();

function unitPrice(item: QuoteItem, qty: number) {
  if (item.customQuote) return 0;
  if (item.tiers) {
    const tier = [...item.tiers].sort((a, b) => b.minQty - a.minQty).find((t) => qty >= t.minQty);
    if (tier) return tier.price;
  }
  return item.price;
}

function formatNT(n: number) {
  return `NT$${n.toLocaleString("en-US")}`;
}

export default function QuoteCalculator() {
  const [activeId, setActiveId] = useState(QUOTE_CATEGORIES[0].id);
  const [qty, setQty] = useState<Record<string, number>>({});

  const active = QUOTE_CATEGORIES.find((c) => c.id === activeId) ?? QUOTE_CATEGORIES[0];

  const allItems = useMemo(
    () => QUOTE_CATEGORIES.flatMap((c) => c.groups.flatMap((g) => g.items.map((item) => ({ item, categoryLabel: c.label })))),
    []
  );

  const selected = allItems
    .map(({ item, categoryLabel }) => ({ item, categoryLabel, q: qty[item.id] ?? 0 }))
    .filter((r) => r.q > 0);

  const priced = selected.filter((r) => !r.item.customQuote);
  const custom = selected.filter((r) => r.item.customQuote);
  const total = priced.reduce((sum, r) => sum + unitPrice(r.item, r.q) * r.q, 0);
  const hasEstimate = selected.some((r) => r.item.estimate);

  function setItemQty(id: string, next: number, maxQty: number) {
    const clamped = Math.max(0, Math.min(maxQty, next));
    setQty((prev) => ({ ...prev, [id]: clamped }));
  }

  function reset() {
    setQty({});
  }

  function lineMessage() {
    const lines: string[] = ["您好，我想詢問以下報價試算："];
    for (const r of priced) {
      const up = unitPrice(r.item, r.q);
      lines.push(`・${r.item.label} x${r.q}${r.item.unit} = ${formatNT(up * r.q)}${r.item.estimate ? "（起）" : ""}`);
    }
    for (const r of custom) {
      lines.push(`・${r.item.label} x${r.q}${r.item.unit}（需另行報價）`);
    }
    lines.push("—");
    lines.push(`預估總金額：${formatNT(total)}${custom.length ? "（不含另行報價項目）" : ""}`);
    lines.push("※ 以上為網站試算參考價，實際費用依需求內容確認，麻煩協助提供正式報價，謝謝！");
    return lines.join("\n");
  }

  function sendToLine() {
    const url = `https://line.me/R/oaMessage/@${LINE_ID}/?${encodeURIComponent(lineMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const hasSelection = selected.length > 0;

  return (
    <div className={styles.calc}>
      <div className={styles.tabs}>
        {QUOTE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveId(c.id)}
            className={c.id === activeId ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          >
            <span className={styles.tabEyebrow}>{c.eyebrow}</span>
            {c.label}
          </button>
        ))}
      </div>
      <p className={styles.categoryDesc}>{active.desc}</p>

      <div className={styles.groups}>
        {active.groups.map((group) => (
          <div className={styles.group} key={group.head}>
            <div className={styles.groupHead}>
              <span>{group.head}</span>
              {group.note && <span className={styles.groupNote}>{group.note}</span>}
            </div>
            {group.items.map((item) => {
              const q = qty[item.id] ?? 0;
              const max = item.maxQty ?? 20;
              const up = unitPrice(item, Math.max(q, 1));
              return (
                <div className={q > 0 ? `${styles.item} ${styles.itemActive}` : styles.item} key={item.id}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    {item.sub && <span className={styles.itemSub}>{item.sub}</span>}
                    <span className={styles.itemPrice}>
                      {item.customQuote ? "另行報價" : `${formatNT(up)} ／${item.unit}`}
                      {item.estimate && !item.customQuote && <small> 起</small>}
                    </span>
                    {item.rangeNote && <span className={styles.itemRangeNote}>{item.rangeNote}</span>}
                  </div>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      aria-label={`減少${item.label}數量`}
                      onClick={() => setItemQty(item.id, q - 1, max)}
                      disabled={q === 0}
                    >
                      −
                    </button>
                    <span className={styles.stepperQty}>{q}</span>
                    <button
                      type="button"
                      aria-label={`增加${item.label}數量`}
                      onClick={() => setItemQty(item.id, q + 1, max)}
                      disabled={q >= max}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryHead}>已選項目</div>
        {!hasSelection ? (
          <p className={styles.empty}>請在上方選擇項目與數量，馬上試算報價</p>
        ) : (
          <div className={styles.summaryLines}>
            {priced.map((r) => (
              <div className={styles.summaryLine} key={r.item.id}>
                <span>
                  {r.item.label} × {r.q}
                  {r.item.unit}
                </span>
                <span>{formatNT(unitPrice(r.item, r.q) * r.q)}</span>
              </div>
            ))}
            {custom.map((r) => (
              <div className={`${styles.summaryLine} ${styles.summaryLineCustom}`} key={r.item.id}>
                <span>
                  {r.item.label} × {r.q}
                  {r.item.unit}
                </span>
                <span>另行報價</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.total}>
          <span>預估總金額</span>
          <span className={styles.totalValue}>{formatNT(total)}</span>
        </div>

        {(hasEstimate || custom.length > 0) && (
          <p className={styles.note}>
            {hasEstimate && "＊ 標示「起」的項目為最低報價，實際費用依需求複雜度調整。"}
            {custom.length > 0 && " ＊ 需另行報價的項目不計入總金額，會在確認需求後另外提供。"}
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={sendToLine} disabled={!hasSelection}>
            透過 LINE 送出這份估價 →
          </button>
          <button type="button" className={styles.resetBtn} onClick={reset} disabled={!hasSelection}>
            清空重新選擇
          </button>
        </div>
      </div>
    </div>
  );
}
