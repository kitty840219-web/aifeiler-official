"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/basePath";
import { askAccountingAi } from "@/lib/accounting/ai";
import {
  calcBusinessTax,
  calcCost,
  calcInvoiceFromTaxIncluded,
  calcInvoiceFromUntaxed,
  calcLaborInsurance,
  calcPayroll,
  calcProfit,
  calcRentalWithholding,
  calcSplit,
  type CostItem,
  type SplitShare,
} from "@/lib/accounting/calculators";
import { exportNodeAsJpg, exportRowsAsExcel, type ExportRow } from "@/lib/accounting/export";
import { loadAccountingHistory, saveAccountingRecord, type AccountingRecord } from "@/lib/accounting/history";
import { ACCOUNTING_RESOURCES } from "@/lib/accounting/resources";
import { ACCOUNTING_TOOLS, type AccountingToolId } from "@/lib/accounting/tools";
import Star from "@/components/Star";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

const SUGGESTED_PROMPTS = ["我要算利潤", "營業稅怎麼算？", "發票要怎麼開", "怎麼成立公司"];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 pt-8" onClick={onClose}>
      <div className="relative h-full max-h-[85svh] w-full max-w-[430px]" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="關閉小幫手"
          className="absolute -right-2 -top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-xl font-bold text-night-dark shadow-soft transition hover:bg-gold-light"
        >
          ✕
        </button>
        <div className="flex h-full w-full flex-col overflow-y-auto rounded-[1.5rem] border border-gold/30 bg-night-dark p-5 text-paper shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <h3 className="font-serif text-lg font-bold text-paper">{title}</h3>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-paper/60">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-paper outline-none"
          placeholder="0"
        />
        {suffix && <span className="shrink-0 text-xs text-paper/50">{suffix}</span>}
      </div>
    </label>
  );
}

function ResultRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${strong ? "text-base font-bold text-gold-light" : "text-sm text-paper"}`}>
      <span className={strong ? "" : "text-paper/60"}>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function num(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// 檔名須用英數字：中文檔名交給瀏覽器的 <a download> 屬性在部分環境會被忽略，
// 導致存下來的檔案沒有副檔名、也打不開。標題文字（顯示在 Excel 內容裡）維持中文即可。
function ExportButtons({
  nodeRef,
  slug,
  title,
  rows,
}: {
  nodeRef: React.RefObject<HTMLElement | null>;
  slug: string;
  title: string;
  rows: ExportRow[];
}) {
  const [savingJpg, setSavingJpg] = useState(false);

  async function handleJpg() {
    if (!nodeRef.current || savingJpg) return;
    setSavingJpg(true);
    try {
      await exportNodeAsJpg(nodeRef.current, slug);
    } finally {
      setSavingJpg(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleJpg}
        disabled={savingJpg}
        className="flex-1 rounded-full border border-gold/30 py-2.5 text-xs font-semibold text-gold-light transition hover:border-gold/60 disabled:opacity-50"
      >
        {savingJpg ? "產生中…" : "📷 下載 JPG"}
      </button>
      <button
        type="button"
        onClick={() => exportRowsAsExcel(slug, title, rows)}
        className="flex-1 rounded-full border border-gold/30 py-2.5 text-xs font-semibold text-gold-light transition hover:border-gold/60"
      >
        📊 下載 Excel
      </button>
    </div>
  );
}

function ProfitTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [price, setPrice] = useState("899");
  const [cost, setCost] = useState("320");
  const [feePercent, setFeePercent] = useState("8");
  const [shipping, setShipping] = useState("60");
  const [ad, setAd] = useState("30");
  const result = calcProfit(num(price), num(cost), num(feePercent), num(shipping), num(ad));
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-3">
      <NumberField label="商品售價" value={price} onChange={setPrice} suffix="元" />
      <NumberField label="成本" value={cost} onChange={setCost} suffix="元" />
      <NumberField label="平台抽成" value={feePercent} onChange={setFeePercent} suffix="%" />
      <NumberField label="物流費" value={shipping} onChange={setShipping} suffix="元" />
      <NumberField label="廣告費" value={ad} onChange={setAd} suffix="元" />
      <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
        <ResultRow label="平台抽成金額" value={fmt(result.platformFee)} />
        <ResultRow label="實際利潤" value={fmt(result.profit)} strong />
        <ResultRow label="利潤率" value={`${result.margin}%`} strong />
      </div>
      <ExportButtons
        nodeRef={resultRef}
        slug="profit-calc"
        title="利潤試算"
        rows={[
          { label: "商品售價", value: fmt(num(price)) },
          { label: "成本", value: fmt(num(cost)) },
          { label: "平台抽成", value: `${feePercent}%` },
          { label: "物流費", value: fmt(num(shipping)) },
          { label: "廣告費", value: fmt(num(ad)) },
          { label: "平台抽成金額", value: fmt(result.platformFee) },
          { label: "實際利潤", value: fmt(result.profit) },
          { label: "利潤率", value: `${result.margin}%` },
        ]}
      />
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "profit",
            toolLabel: "利潤小幫手",
            title: `售價 ${fmt(num(price))} 利潤試算`,
            resultLabel: "利潤",
            resultValue: `${fmt(result.profit)}（${result.margin}%）`,
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function CostTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [items, setItems] = useState<CostItem[]>([
    { label: "材料工具", amount: 150 },
    { label: "平台抽成", amount: 72 },
    { label: "物流費", amount: 60 },
  ]);
  const [price, setPrice] = useState("899");
  const result = calcCost(items, num(price));
  const resultRef = useRef<HTMLDivElement>(null);

  function updateItem(i: number, patch: Partial<CostItem>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-paper/60">成本項目</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item.label}
            onChange={(e) => updateItem(i, { label: e.target.value })}
            className="w-1/2 rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
          />
          <input
            type="number"
            value={item.amount}
            onChange={(e) => updateItem(i, { amount: num(e.target.value) })}
            className="w-1/2 rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { label: "新項目", amount: 0 }])}
        className="text-xs font-semibold text-gold-light"
      >
        ＋ 新增一項
      </button>
      <NumberField label="商品售價（選填，用來算成本率）" value={price} onChange={setPrice} suffix="元" />
      <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
        <ResultRow label="總成本" value={fmt(result.total)} strong />
        {num(price) > 0 && <ResultRow label="成本率" value={`${result.ratio}%`} />}
      </div>
      <ExportButtons
        nodeRef={resultRef}
        slug="cost-calc"
        title="成本試算"
        rows={[
          ...items.map((item) => ({ label: item.label, value: fmt(item.amount) })),
          { label: "商品售價", value: fmt(num(price)) },
          { label: "總成本", value: fmt(result.total) },
          ...(num(price) > 0 ? [{ label: "成本率", value: `${result.ratio}%` }] : []),
        ]}
      />
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "cost",
            toolLabel: "成本小幫手",
            title: "成本試算",
            resultLabel: "總成本",
            resultValue: fmt(result.total),
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function SplitTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [total, setTotal] = useState("120000");
  const [shares, setShares] = useState<SplitShare[]>([
    { label: "成員 A", percent: 25 },
    { label: "成員 B", percent: 25 },
    { label: "成員 C", percent: 25 },
    { label: "成員 D", percent: 25 },
  ]);
  const result = calcSplit(num(total), shares);
  const resultRef = useRef<HTMLDivElement>(null);

  function updateShare(i: number, patch: Partial<SplitShare>) {
    setShares((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-3">
      <NumberField label="總金額" value={total} onChange={setTotal} suffix="元" />
      <p className="text-xs font-semibold text-paper/60">分潤比例</p>
      {shares.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={s.label}
            onChange={(e) => updateShare(i, { label: e.target.value })}
            className="w-1/2 rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
          />
          <div className="flex w-1/2 items-center gap-1 rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5">
            <input
              type="number"
              value={s.percent}
              onChange={(e) => updateShare(i, { percent: num(e.target.value) })}
              className="w-full bg-transparent text-sm text-paper outline-none"
            />
            <span className="text-xs text-paper/50">%</span>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setShares((prev) => [...prev, { label: `成員 ${prev.length + 1}`, percent: 0 }])}
        className="text-xs font-semibold text-gold-light"
      >
        ＋ 新增一位
      </button>
      {result.percentSum !== 100 && <p className="text-xs text-blush">目前比例總和 {result.percentSum}%，建議調整到 100%</p>}
      <div ref={resultRef} className="mt-4 space-y-1 rounded-xl bg-night-light/25 p-4">
        {result.results.map((r) => (
          <ResultRow key={r.label} label={`${r.label}（${r.percent}%）`} value={fmt(r.amount)} />
        ))}
      </div>
      <ExportButtons
        nodeRef={resultRef}
        slug="split-calc"
        title="分潤試算"
        rows={[
          { label: "總金額", value: fmt(num(total)) },
          ...result.results.map((r) => ({ label: `${r.label}（${r.percent}%）`, value: fmt(r.amount) })),
        ]}
      />
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "split",
            toolLabel: "分潤小幫手",
            title: "團隊分潤計算",
            resultLabel: "總金額",
            resultValue: `${fmt(num(total))}（${shares.length} 位成員）`,
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function InvoiceTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [mode, setMode] = useState<"taxIncluded" | "untaxed">("taxIncluded");
  const [amount, setAmount] = useState("3000");
  const [sellerName, setSellerName] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [buyerType, setBuyerType] = useState<"company" | "individual">("individual");
  const [buyerName, setBuyerName] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const result = mode === "taxIncluded" ? calcInvoiceFromTaxIncluded(num(amount)) : calcInvoiceFromUntaxed(num(amount));
  const resultRef = useRef<HTMLDivElement>(null);
  const isTriplicate = buyerType === "company";

  return (
    <div className="space-y-3">
      <div className="flex rounded-xl border border-gold/20 p-1">
        <button
          type="button"
          onClick={() => setMode("taxIncluded")}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${mode === "taxIncluded" ? "bg-gold text-night-dark" : "text-paper/60"}`}
        >
          已知含稅金額
        </button>
        <button
          type="button"
          onClick={() => setMode("untaxed")}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${mode === "untaxed" ? "bg-gold text-night-dark" : "text-paper/60"}`}
        >
          已知未稅金額
        </button>
      </div>
      <NumberField label={mode === "taxIncluded" ? "含稅金額" : "未稅金額"} value={amount} onChange={setAmount} suffix="元" />

      <p className="pt-1 text-xs font-semibold text-paper/60">賣方（開立發票方）</p>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-paper/60">賣方名稱／抬頭</span>
        <input
          value={sellerName}
          onChange={(e) => setSellerName(e.target.value)}
          placeholder="例如：艾飛樂數位文創個人工作室"
          className="w-full rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-paper/60">賣方統一編號</span>
        <input
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          placeholder="12345678"
          inputMode="numeric"
          maxLength={8}
          className="w-full rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
        />
      </label>

      <p className="pt-1 text-xs font-semibold text-paper/60">買受人</p>
      <div>
        <div className="flex">
          <button
            type="button"
            onClick={() => setBuyerType("company")}
            className={`flex-1 pb-2 text-center transition ${buyerType === "company" ? "text-gold-light" : "text-paper/60"}`}
          >
            <span className="block text-sm font-bold">開給公司</span>
            <span className="block text-[11px]">三聯式發票</span>
          </button>
          <button
            type="button"
            onClick={() => setBuyerType("individual")}
            className={`flex-1 pb-2 text-center transition ${buyerType === "individual" ? "text-gold-light" : "text-paper/60"}`}
          >
            <span className="block text-sm font-bold">開給個人</span>
            <span className="block text-[11px]">二聯式發票</span>
          </button>
        </div>
        <div className="relative h-1 overflow-hidden rounded-full bg-night-light/30">
          <div
            className={`absolute inset-y-0 w-1/2 rounded-full bg-gold transition-all duration-300 ${buyerType === "company" ? "left-0" : "left-1/2"}`}
          />
        </div>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-paper/60">{isTriplicate ? "買受人名稱／抬頭" : "買受人姓名（選填）"}</span>
        <input
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder={isTriplicate ? "例如：○○有限公司" : "選填，會印在發票上"}
          className="w-full rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
        />
      </label>
      {isTriplicate && (
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-paper/60">買受人統一編號</span>
          <input
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            placeholder="12345678"
            inputMode="numeric"
            maxLength={8}
            className="w-full rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
          />
        </label>
      )}

      <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
        {(sellerName || sellerId) && (
          <>
            <ResultRow label="賣方" value={[sellerName, sellerId].filter(Boolean).join("　統編：")} />
            <div className="my-2 h-px bg-gold/15" />
          </>
        )}
        {(buyerName || buyerId) && (
          <>
            <ResultRow label="買受人" value={[buyerName, buyerId && `統編：${buyerId}`].filter(Boolean).join("　")} />
            <div className="my-2 h-px bg-gold/15" />
          </>
        )}
        <ResultRow label="未稅金額" value={fmt(result.untaxed)} />
        <ResultRow label="營業稅額（5%）" value={fmt(result.tax)} />
        <ResultRow label="含稅總額" value={fmt(result.taxIncluded)} strong />
      </div>
      <p className="text-[11px] leading-5 text-paper/50">＊{isTriplicate ? "三聯式發票" : "二聯式發票"}：{isTriplicate ? "開立給公司行號、機關團體等營業人，買受人統編為必填。" : "開立給一般消費者，買受人姓名為選填。"}</p>
      <ExportButtons
        nodeRef={resultRef}
        slug="invoice-calc"
        title="發票試算"
        rows={[
          ...(sellerName ? [{ label: "賣方名稱", value: sellerName }] : []),
          ...(sellerId ? [{ label: "賣方統編", value: sellerId }] : []),
          { label: "發票種類", value: isTriplicate ? "三聯式" : "二聯式" },
          ...(buyerName ? [{ label: "買受人名稱", value: buyerName }] : []),
          ...(buyerId ? [{ label: "買受人統編", value: buyerId }] : []),
          { label: "未稅金額", value: fmt(result.untaxed) },
          { label: "營業稅額（5%）", value: fmt(result.tax) },
          { label: "含稅總額", value: fmt(result.taxIncluded) },
        ]}
      />
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "invoice",
            toolLabel: "發票小幫手",
            title: buyerName ? `${buyerName}．${isTriplicate ? "三聯式發票" : "二聯式發票"}` : isTriplicate ? "開立三聯式發票" : "開立二聯式發票",
            resultLabel: "含稅",
            resultValue: fmt(result.taxIncluded),
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function TaxTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [salesTax, setSalesTax] = useState("15000");
  const [purchaseTax, setPurchaseTax] = useState("2550");
  const result = calcBusinessTax(num(salesTax), num(purchaseTax));
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-3">
      <NumberField label="銷項稅額（本期銷貨）" value={salesTax} onChange={setSalesTax} suffix="元" />
      <NumberField label="進項稅額（本期進貨／費用）" value={purchaseTax} onChange={setPurchaseTax} suffix="元" />
      <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
        {result.payable > 0 ? (
          <ResultRow label="本期應繳稅額" value={fmt(result.payable)} strong />
        ) : (
          <ResultRow label="本期留抵／可退稅額" value={fmt(result.refundable)} strong />
        )}
      </div>
      <ExportButtons
        nodeRef={resultRef}
        slug="vat-calc"
        title="營業稅試算"
        rows={[
          { label: "銷項稅額", value: fmt(num(salesTax)) },
          { label: "進項稅額", value: fmt(num(purchaseTax)) },
          result.payable > 0
            ? { label: "本期應繳稅額", value: fmt(result.payable) }
            : { label: "本期留抵／可退稅額", value: fmt(result.refundable) },
        ]}
      />
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "tax",
            toolLabel: "營業稅小幫手",
            title: "營業稅試算",
            resultLabel: "應繳稅額",
            resultValue: fmt(result.payable || result.refundable),
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function PayrollTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [base, setBase] = useState("32000");
  const [bonus, setBonus] = useState("0");
  const [insurance, setInsurance] = useState("1200");
  const [tax, setTax] = useState("0");
  const result = calcPayroll(num(base), num(bonus), num(insurance), num(tax));
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-3">
      <NumberField label="底薪" value={base} onChange={setBase} suffix="元" />
      <NumberField label="加班費／獎金" value={bonus} onChange={setBonus} suffix="元" />
      <NumberField label="勞健保自付額" value={insurance} onChange={setInsurance} suffix="元" />
      <NumberField label="代扣所得稅" value={tax} onChange={setTax} suffix="元" />
      <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
        <ResultRow label="應發薪資" value={fmt(result.gross)} />
        <ResultRow label="實領薪資" value={fmt(result.netPay)} strong />
      </div>
      <ExportButtons
        nodeRef={resultRef}
        slug="payroll-calc"
        title="薪資試算"
        rows={[
          { label: "底薪", value: fmt(num(base)) },
          { label: "加班費／獎金", value: fmt(num(bonus)) },
          { label: "勞健保自付額", value: fmt(num(insurance)) },
          { label: "代扣所得稅", value: fmt(num(tax)) },
          { label: "應發薪資", value: fmt(result.gross) },
          { label: "實領薪資", value: fmt(result.netPay) },
        ]}
      />
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "payroll",
            toolLabel: "薪資小幫手",
            title: "薪資試算",
            resultLabel: "實領",
            resultValue: fmt(result.netPay),
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function LaborInsuranceTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [salary, setSalary] = useState("32000");
  const [dependents, setDependents] = useState("0");
  const result = calcLaborInsurance(num(salary), num(dependents));
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-3">
      <NumberField label="投保薪資" value={salary} onChange={setSalary} suffix="元" />
      <NumberField label="健保眷屬人數" value={dependents} onChange={setDependents} suffix="人" />
      <div ref={resultRef} className="mt-4 space-y-1 rounded-xl bg-night-light/25 p-4">
        <ResultRow label="勞保費（員工負擔）" value={fmt(result.laborEmployee)} />
        <ResultRow label="健保費（員工負擔）" value={fmt(result.healthEmployee)} />
        <ResultRow label="員工自付合計" value={fmt(result.employeeTotal)} strong />
        <div className="my-2 h-px bg-gold/15" />
        <ResultRow label="勞退提撥（雇主 6%）" value={fmt(result.pensionEmployer)} />
        <ResultRow label="公司負擔合計" value={fmt(result.employerTotal)} strong />
      </div>
      <ExportButtons
        nodeRef={resultRef}
        slug="labor-insurance-calc"
        title="勞健保試算"
        rows={[
          { label: "投保薪資", value: fmt(num(salary)) },
          { label: "健保眷屬人數", value: `${num(dependents)}人` },
          { label: "勞保費（員工負擔）", value: fmt(result.laborEmployee) },
          { label: "健保費（員工負擔）", value: fmt(result.healthEmployee) },
          { label: "員工自付合計", value: fmt(result.employeeTotal) },
          { label: "勞退提撥（雇主 6%）", value: fmt(result.pensionEmployer) },
          { label: "公司負擔合計", value: fmt(result.employerTotal) },
        ]}
      />
      <p className="text-[11px] leading-5 text-paper/50">
        ＊員工健保費依本人實際眷屬數（最多計收至本人＋3 位眷屬）計算；雇主負擔則依全國平均眷屬數 1.56 人計算，與員工實際眷屬數無關。簡化參考費率，實際請以勞保局／健保署最新公告費率與級距為準。
      </p>
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "laborInsurance",
            toolLabel: "勞健保小幫手",
            title: "勞健保試算",
            resultLabel: "員工自付",
            resultValue: fmt(result.employeeTotal),
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

function RentalTool({ onDone }: { onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  const [rent, setRent] = useState("25000");
  const [landlordType, setLandlordType] = useState<"individual" | "company">("individual");
  const [landlordName, setLandlordName] = useState("");
  const [landlordId, setLandlordId] = useState("");
  const result = calcRentalWithholding(num(rent), landlordType);
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex rounded-xl border border-gold/20 p-1">
        <button
          type="button"
          onClick={() => setLandlordType("individual")}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${landlordType === "individual" ? "bg-gold text-night-dark" : "text-paper/60"}`}
        >
          房東是個人
        </button>
        <button
          type="button"
          onClick={() => setLandlordType("company")}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${landlordType === "company" ? "bg-gold text-night-dark" : "text-paper/60"}`}
        >
          房東是公司／行號
        </button>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-paper/60">房東姓名／抬頭（選填）</span>
        <input
          value={landlordName}
          onChange={(e) => setLandlordName(e.target.value)}
          placeholder={landlordType === "individual" ? "房東姓名" : "例如：○○有限公司"}
          className="w-full rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-paper/60">
          {landlordType === "individual" ? "房東身分證字號（選填，開立免扣繳憑單用）" : "房東統一編號（選填）"}
        </span>
        <input
          value={landlordId}
          onChange={(e) => setLandlordId(e.target.value)}
          placeholder={landlordType === "individual" ? "A123456789" : "12345678"}
          className="w-full rounded-xl border border-gold/20 bg-night-light/20 px-3 py-2.5 text-sm text-paper outline-none"
        />
      </label>
      <NumberField label="每月租金" value={rent} onChange={setRent} suffix="元" />
      {result.needsWithholding ? (
        <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
          {(landlordName || landlordId) && (
            <>
              <ResultRow label="房東" value={[landlordName, landlordId].filter(Boolean).join("　")} />
              <div className="my-2 h-px bg-gold/15" />
            </>
          )}
          <ResultRow label="租金所得扣繳稅額（10%）" value={fmt(result.withholding)} />
          <ResultRow
            label={num(rent) >= 20010 ? "二代健保補充保費（2.11%）" : "二代健保補充保費（未達門檻免收）"}
            value={fmt(result.supplementaryPremium)}
          />
          <ResultRow label="實付房東金額" value={fmt(result.netPayment)} strong />
        </div>
      ) : (
        <div ref={resultRef} className="mt-4 rounded-xl bg-night-light/25 p-4">
          {(landlordName || landlordId) && (
            <>
              <ResultRow label="房東" value={[landlordName, landlordId].filter(Boolean).join("　")} />
              <div className="my-2 h-px bg-gold/15" />
            </>
          )}
          <p className="text-sm leading-6 text-paper/80">房東是公司或行號時免辦理租金扣繳，請直接請對方開立統一發票。</p>
        </div>
      )}
      <ExportButtons
        nodeRef={resultRef}
        slug="rental-withholding-calc"
        title="租金扣繳試算"
        rows={[
          ...(landlordName ? [{ label: "房東姓名／抬頭", value: landlordName }] : []),
          ...(landlordId ? [{ label: landlordType === "individual" ? "房東身分證字號" : "房東統一編號", value: landlordId }] : []),
          { label: "每月租金", value: fmt(num(rent)) },
          { label: "房東類型", value: landlordType === "individual" ? "個人" : "公司／行號" },
          ...(result.needsWithholding
            ? [
                { label: "租金所得扣繳稅額（10%）", value: fmt(result.withholding) },
                { label: "二代健保補充保費（2.11%）", value: fmt(result.supplementaryPremium) },
                { label: "實付房東金額", value: fmt(result.netPayment) },
              ]
            : [{ label: "備註", value: "房東是公司或行號時免辦理租金扣繳" }]),
        ]}
      />
      <p className="text-[11px] leading-5 text-paper/50">
        ＊房東為個人時，公司／行號支付租金需按 10% 扣繳所得稅；單次給付達 20,010 元（113 年起）需另扣 2.11% 二代健保補充保費。實際規定請以國稅局最新公告為準。
      </p>
      <button
        type="button"
        onClick={() =>
          onDone({
            tool: "rental",
            toolLabel: "租金扣繳小幫手",
            title: landlordName ? `${landlordName}．租金 ${fmt(num(rent))}` : `租金 ${fmt(num(rent))}（${landlordType === "individual" ? "個人房東" : "公司房東"}）`,
            resultLabel: "實付金額",
            resultValue: fmt(result.netPayment),
          })
        }
        className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-night-dark transition hover:bg-gold-light"
      >
        儲存這筆試算
      </button>
    </div>
  );
}

const COMPANY_STEPS = [
  { title: "公司名稱預查", desc: "到經濟部「公司名稱及所營事業預查系統」查詢並保留特取名稱。" },
  { title: "準備登記文件", desc: "章程、股東名冊、資本額存款證明、負責人身分證明等。" },
  { title: "資本額存入銀行", desc: "開立籌備處帳戶存入資本額；達一定金額需會計師簽證。" },
  { title: "線上一站式申請", desc: "至「公司設立一站式線上申請作業」送件（公司登記＋稅籍登記＋工商憑證）。" },
  { title: "領取核准函與統編", desc: "完成審核後取得公司登記核准函及統一編號。" },
  { title: "刻公司大小章、開戶", desc: "刻製公司大小章，並以核准文件開立公司銀行帳戶。" },
  { title: "請購統一發票", desc: "向國稅局請購統一發票，正式開始營運與開立發票。" },
];

const COMPANY_QA = [
  { q: "成立公司好還是行號比較好？", a: "行號設立較簡單、記帳相對單純，但負責人須負無限清償責任；公司（有限公司）則是股東以出資額為限負責，日後也能視經營規模再由行號改組為公司。" },
  { q: "資本額要準備多少？", a: "法規並未硬性規定最低資本額，但建議至少要能支應開辦初期的必要費用，資本額過低仍可能被承辦人員要求補充說明或退件。" },
  { q: "統一編號可以自己選嗎？", a: "統編是由主管機關隨機配發，無法指定；若拿到的號碼不滿意，可以向核發單位申請更改一次。" },
  { q: "公司登記後還沒開始營業，需要繳稅嗎？", a: "只要完成登記即取得稅籍，仍需依規定辦理相關申報；實際是否須繳稅則視當期有無銷售額與所得而定，建議先與會計師確認。" },
  { q: "可以用自己的住家登記公司地址嗎？", a: "可以，但公司屬獨立法人，須簽立正式租賃契約並認列租金所得；行號則可用房屋所有人、配偶或直系血親的房屋簽立無償使用同意書。" },
];

const ACCOUNTING_FAQ = [
  { q: "還沒辦理稅籍登記，被國稅局查獲前後有差嗎？", a: "透過網路銷售貨物或勞務，當月銷售額未達起徵點（銷售貨物 10 萬元、銷售勞務 5 萬元）可以暫免辦理稅籍登記；一旦達到起徵點，應於次月底前完成登記。查獲前主動補辦，只會就已達起徵點後至補辦登記前的銷售額補徵營業稅；查獲後才補辦，除了補稅外還會被處以罰鍰，建議一達到起徵點就儘早辦理。" },
  { q: "什麼時候一定要開始開立統一發票？", a: "只要被國稅局核定為應使用發票的營業人，或原本免用發票、但當月營業額達到 20 萬元，就必須開始開立統一發票。" },
  { q: "買家棄標或殺價成交，銷售額要怎麼算？", a: "可以向拍賣平台申請出具交易證明，或提供實際匯款紀錄等佐證資料，經國稅局審核認定後，就能把實際少收的差額從銷售額中扣除。" },
  { q: "只做網路銷售，商業登記要怎麼辦？", a: "如果本身已有實體店面、只是同時在網路上販售，登記方式跟一般實體商家相同；如果完全沒有實體店面、純網路銷售，則需要在營業項目中額外加註「F399040 無店面零售業」。" },
  { q: "網拍商品的發票要什麼時候寄給買家？", a: "原則上：還沒收到貨款的話，出貨時就要隨貨附上發票；已經先收到貨款的話，收到款項當下就要開立發票。若商品有鑑賞期、可以免費退貨，可以等鑑賞期過後再寄出紙本發票；但雲端電子發票不適用這個延後寄送的規定。" },
];

function QaAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-2xl border transition ${open ? "border-gold/40 bg-night-light/30" : "border-gold/10 bg-night-light/15"}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-start gap-3 p-3.5 text-left"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-night-dark">?</span>
              <span className="flex-1 text-sm font-semibold leading-5 text-paper">{item.q}</span>
              <span className={`mt-0.5 shrink-0 text-gold-light transition-transform ${open ? "rotate-90" : ""}`}>›</span>
            </button>
            {open && <p className="px-3.5 pb-3.5 pl-[3.25rem] text-xs leading-5 text-paper/70">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

function CompanyGuide() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-5">
      <div ref={contentRef}>
        <p className="text-xs leading-5 text-paper/60">7 個步驟，帶你了解成立公司的大致流程（實際文件與規定請以最新公告為準）。</p>
        <ol className="mt-3 space-y-3">
          {COMPANY_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold-light">{i + 1}</span>
              <div>
                <p className="text-sm font-semibold text-paper">{s.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-paper/60">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs font-semibold tracking-[0.1em] text-gold-light">常見問題 Q&amp;A</p>
        <div className="mt-3">
          <QaAccordion items={COMPANY_QA} />
        </div>
      </div>
      <ExportButtons
        nodeRef={contentRef}
        slug="company-setup-guide"
        title="公司設立指南"
        rows={[
          ...COMPANY_STEPS.map((s, i) => ({ label: `步驟${i + 1}．${s.title}`, value: s.desc })),
          ...COMPANY_QA.map((item) => ({ label: `Q．${item.q}`, value: `A．${item.a}` })),
        ]}
      />
    </div>
  );
}

function ToolBody({ id, onDone }: { id: AccountingToolId; onDone: (r: Omit<AccountingRecord, "id" | "date">) => void }) {
  if (id === "profit") return <ProfitTool onDone={onDone} />;
  if (id === "cost") return <CostTool onDone={onDone} />;
  if (id === "split") return <SplitTool onDone={onDone} />;
  if (id === "invoice") return <InvoiceTool onDone={onDone} />;
  if (id === "tax") return <TaxTool onDone={onDone} />;
  if (id === "payroll") return <PayrollTool onDone={onDone} />;
  if (id === "laborInsurance") return <LaborInsuranceTool onDone={onDone} />;
  if (id === "rental") return <RentalTool onDone={onDone} />;
  return <CompanyGuide />;
}

export default function AccountingHelper() {
  const [view, setView] = useState<"home" | "howto">("home");
  const [openTool, setOpenTool] = useState<AccountingToolId | null>(null);
  const [history, setHistory] = useState<AccountingRecord[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<{ text: string; suggested: AccountingToolId | ""; resource: string } | null>(null);
  const [askError, setAskError] = useState("");

  useEffect(() => {
    queueMicrotask(() => setHistory(loadAccountingHistory()));
  }, []);

  function handleDone(record: Omit<AccountingRecord, "id" | "date">) {
    setHistory(saveAccountingRecord(record));
    setOpenTool(null);
  }

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim();
    if (!text) return;
    setAsking(true);
    setAskError("");
    setAnswer(null);
    try {
      const result = await askAccountingAi(text);
      setAnswer({ text: result.answer, suggested: result.suggestedTool, resource: result.suggestedResource });
    } catch (e) {
      setAskError(e instanceof Error ? e.message : "小幫手暫時無法回答，請稍後再試");
    } finally {
      setAsking(false);
    }
  }

  const openToolMeta = openTool ? ACCOUNTING_TOOLS.find((t) => t.id === openTool) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night-dark pb-8 pt-20">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_130px] items-center gap-4 rounded-[2rem] bg-night-light/15 px-6 py-7">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Star className="h-3 w-3 text-gold-light" />
                <p className="text-xs font-semibold tracking-[0.35em] text-gold-light">ACCOUNTING</p>
              </div>
              <h1 className="font-serif text-2xl font-bold text-paper">會計小幫手</h1>
              <p className="mt-3 text-sm leading-6 text-paper/70">簡單．快速．專業．安心 ❤️</p>
            </div>
            <div className="animate-float-slow relative h-40 w-full">
              <Image src={asset("/images/pricing-guide-cutout.webp")} alt="小艾拿著清單，準備幫你試算" fill className="object-contain" sizes="130px" />
            </div>
          </div>

          <div className="relative mt-5 overflow-hidden">
            <div className="animate-marquee flex w-max whitespace-nowrap">
              <span className="pr-16 font-serif text-base text-gold-light sm:text-lg">✨ 會計小幫手持續更新中，敬請期待更多功能上線．有任何想法歡迎告訴艾飛樂 ✨</span>
              <span aria-hidden className="pr-16 font-serif text-base text-gold-light sm:text-lg">✨ 會計小幫手持續更新中，敬請期待更多功能上線．有任何想法歡迎告訴艾飛樂 ✨</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-night-dark px-4 pb-20 pt-4 sm:px-6">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <div className="flex gap-2 rounded-full border border-gold/15 bg-night-light/10 p-1">
            <button
              type="button"
              onClick={() => setView("home")}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${view === "home" ? "bg-gold text-night-dark" : "text-paper/60"}`}
            >
              首頁
            </button>
            <button
              type="button"
              onClick={() => setView("howto")}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${view === "howto" ? "bg-gold text-night-dark" : "text-paper/60"}`}
            >
              使用說明
            </button>
          </div>

          {view === "home" ? (
            <>
              {/* AI hero */}
              <section className="mt-5 rounded-[1.75rem] border border-gold/15 bg-night-light/15 p-5 shadow-card">
                <p className="font-serif text-lg font-bold text-paper">嗨！我是艾飛樂</p>
                <p className="mt-1 text-xs text-paper/60">有任何會計問題，都可以問我喔！</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAsk();
                  }}
                  className="mt-3 flex items-center gap-2 rounded-2xl border border-gold/20 bg-night-light/20 px-4 py-3"
                >
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：我要算利潤、如何開發票、營業稅怎麼算？"
                    className="min-w-0 flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-paper/40"
                  />
                  <button
                    type="submit"
                    disabled={asking}
                    aria-label="送出問題"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-night-dark disabled:opacity-50"
                  >
                    {asking ? "…" : "➤"}
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setQuestion(p);
                        handleAsk(p);
                      }}
                      className="rounded-full border border-gold/20 px-3 py-1.5 text-xs text-paper/60 transition hover:border-gold/50 hover:text-gold-light"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {asking && <p className="mt-4 text-xs text-paper/60">艾飛樂正在想...</p>}
                {askError && <p className="mt-4 text-xs text-blush">{askError}</p>}
                {answer && (
                  <div className="mt-4 rounded-2xl border border-gold/15 bg-night-light/20 p-4">
                    <p className="text-sm leading-6 text-paper/90">{answer.text}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {answer.suggested && (
                        <button
                          type="button"
                          onClick={() => setOpenTool(answer.suggested as AccountingToolId)}
                          className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-night-dark transition hover:bg-gold-light"
                        >
                          打開 {ACCOUNTING_TOOLS.find((t) => t.id === answer.suggested)?.label} →
                        </button>
                      )}
                      {answer.resource && (
                        <a
                          href={ACCOUNTING_RESOURCES.find((r) => r.name === answer.resource)?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-gold/30 px-4 py-2 text-xs font-semibold text-gold-light transition hover:border-gold/60"
                        >
                          前往 {answer.resource} →
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Tool grid */}
              <section className="mt-6">
                <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-gold-light">★ 常用小幫手．點擊下方功能，讓艾飛樂幫你快速計算與解答</p>
                <div className="grid grid-cols-2 gap-3">
                  {ACCOUNTING_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setOpenTool(tool.id)}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-gold/15 bg-night-light/15 p-4 text-left shadow-card transition hover:border-gold/40"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-lg text-night-dark">{tool.icon}</span>
                      <span className="text-sm font-bold text-paper">{tool.label}</span>
                      <span className="text-[11px] leading-4 text-paper/60">{tool.desc}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Official resources */}
              <section className="mt-6">
                <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-gold-light">🏛 官方資源．勞資與稅務問題可直接查詢</p>
                <div className="space-y-2">
                  {ACCOUNTING_RESOURCES.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-gold/15 bg-night-light/15 px-4 py-3 shadow-card transition hover:border-gold/40"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-paper">{r.name}</span>
                        <span className="mt-0.5 block text-[11px] text-paper/50">{r.note}</span>
                      </span>
                      <span className="shrink-0 text-gold-light">→</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* General FAQ */}
              <section className="mt-6">
                <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-gold-light">❓ 常見問題．稅務與網拍常見疑問</p>
                <QaAccordion items={ACCOUNTING_FAQ} />
              </section>

              {/* Recent records */}
              {history.length > 0 && (
                <section className="mt-6">
                  <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-gold-light">🕐 最近的試算紀錄</p>
                  <div className="space-y-2">
                    {history.map((r) => (
                      <div key={r.id} className="rounded-xl border border-gold/15 bg-night-light/15 p-3.5 shadow-card">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-gold-light">{r.toolLabel}</span>
                          <span className="text-[11px] text-paper/55">{r.date}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-paper">{r.title}</p>
                        <p className="mt-0.5 text-xs text-paper/60">
                          {r.resultLabel} <span className="font-mono font-semibold text-paper">{r.resultValue}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="mt-5 space-y-4">
              <div className="rounded-[1.75rem] border border-gold/15 bg-night-light/15 p-5 text-center shadow-card">
                <p className="font-serif text-xl font-bold text-paper">使用說明</p>
                <p className="mt-1 text-xs text-paper/60">四個步驟，輕鬆完成各項會計試算</p>
              </div>
              {[
                { n: 1, title: "選擇想使用的小幫手", desc: "點選常用小幫手裡的任一功能卡片，開始試算。" },
                { n: 2, title: "輸入資料", desc: "依畫面提示輸入售價、成本、金額等資訊即可，不用一次填齊所有欄位。" },
                { n: 3, title: "自動計算", desc: "系統會即時算出利潤、成本率、稅額、分潤金額等結果。" },
                { n: 4, title: "查看並儲存結果", desc: "確認試算結果，按下「儲存這筆試算」就會出現在首頁的最近紀錄裡。" },
              ].map((s) => (
                <div key={s.n} className="rounded-2xl border border-gold/15 bg-night-light/15 p-5 shadow-card">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold-light">{s.n}</span>
                    <p className="text-sm font-bold text-paper">{s.title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-paper/60">{s.desc}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-gold/15 bg-night-light/10 p-4 text-xs leading-6 text-paper/60">
                💡 所有試算皆為參考結果，實際金額請以帳務資料為準；遇到特殊會計或稅務問題，建議再與專業會計師確認。
              </div>
            </section>
          )}
        </div>
      </section>

      {openTool && openToolMeta && (
        <Modal title={openToolMeta.label} onClose={() => setOpenTool(null)}>
          <ToolBody id={openTool} onDone={handleDone} />
        </Modal>
      )}
    </div>
  );
}
