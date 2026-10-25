"use client";

import { FormEvent, useState } from "react";

const contactTimes = ["工作日 09:00–12:00", "工作日 12:00–18:00", "假日 09:00–12:00", "假日 12:00–18:00"];

const serviceTypes = [
  "塔羅個人占卜（單題 NT$400／套餐 NT$1,000）",
  "影片剪輯（請填寫影片秒數與風格參考）",
  "平面設計（請填寫參考風格）",
  "客製化商業／個人貼圖設計（請填寫張數）",
  "網站架設（請填寫參考風格）",
  "客製化印刷商品",
];

function CheckOption({ id, label, name }: { id: string; label: string; name: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/20 bg-night-light/15 px-4 py-3 text-sm leading-relaxed text-paper/90 transition hover:border-gold/55 hover:bg-night-light/30">
      <input id={id} name={name} type="checkbox" value={label} className="mt-1 h-4 w-4 accent-gold" />
      <span>{label}</span>
    </label>
  );
}

export default function ContactInquiryForm() {
  const [message, setMessage] = useState("");
  const [desktopMessage, setDesktopMessage] = useState("");

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const preferredTimes = form.getAll("contactTime").map(String);
    const services = form.getAll("serviceType").map(String);

    if (!preferredTimes.length || !services.length) {
      setMessage("請至少選擇一個方便聯絡時間與需求類型，再送出表單。 ");
      return;
    }

    const lineMessage = [
      "【艾飛樂｜網站聯絡表單】",
      `姓名：${form.get("name")}`,
      `電子信箱：${form.get("email")}`,
      `LINE ID：${form.get("lineId") || "未提供"}`,
      `聯絡電話：${form.get("phone")}`,
      `方便聯絡時間：${preferredTimes.join("、")}`,
      `需求類型：${services.join("、")}`,
      `需求說明：${form.get("details") || "未提供"}`,
    ].join("\n");

    const lineUrl = `https://line.me/R/oaMessage/%40153yhemn/?${encodeURIComponent(lineMessage)}`;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      setMessage("正在開啟官方 LINE，請確認訊息內容後按下傳送。 ");
      window.location.assign(lineUrl);
      return;
    }

    void navigator.clipboard?.writeText(lineMessage);
    setDesktopMessage(lineMessage);
    setMessage("內容已複製。請用手機開啟官方 LINE，貼上並傳送給 @153yhemn。 ");
  }

  return (
    <form onSubmit={submitInquiry} className="rounded-[2rem] border border-gold/25 bg-night-light/20 p-5 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-paper">
          電子信箱 <span className="text-gold-light">*</span>
          <input required name="email" type="email" placeholder="請輸入您的電子信箱" className="rounded-xl border border-paper/20 bg-night-dark/45 px-4 py-3 text-paper outline-none placeholder:text-paper/40 focus:border-gold" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-paper">
          姓名 <span className="text-gold-light">*</span>
          <input required name="name" placeholder="請輸入您的姓名" className="rounded-xl border border-paper/20 bg-night-dark/45 px-4 py-3 text-paper outline-none placeholder:text-paper/40 focus:border-gold" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-paper">
          LINE ID
          <input name="lineId" placeholder="請輸入您的 LINE ID" className="rounded-xl border border-paper/20 bg-night-dark/45 px-4 py-3 text-paper outline-none placeholder:text-paper/40 focus:border-gold" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-paper">
          聯絡電話 <span className="text-gold-light">*</span>
          <input required name="phone" type="tel" placeholder="請輸入您的聯絡電話" className="rounded-xl border border-paper/20 bg-night-dark/45 px-4 py-3 text-paper outline-none placeholder:text-paper/40 focus:border-gold" />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="text-base font-bold text-paper">方便聯絡時間 <span className="text-gold-light">*</span></legend>
        <p className="mt-1 text-sm text-paper/65">可複選</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {contactTimes.map((item, index) => <CheckOption key={item} id={`time-${index}`} name="contactTime" label={item} />)}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-base font-bold text-paper">需求類型 <span className="text-gold-light">*</span></legend>
        <p className="mt-1 text-sm text-paper/65">可複選</p>
        <div className="mt-3 grid gap-3">
          {serviceTypes.map((item, index) => <CheckOption key={item} id={`service-${index}`} name="serviceType" label={item} />)}
        </div>
      </fieldset>

      <label className="mt-8 grid gap-2 text-sm font-semibold text-paper">
        需求說明
        <textarea name="details" rows={5} placeholder="例如：影片長度、想要的設計風格、貼圖張數、參考連結或其他想法" className="resize-y rounded-xl border border-paper/20 bg-night-dark/45 px-4 py-3 text-paper outline-none placeholder:text-paper/40 focus:border-gold" />
      </label>

      <p aria-live="polite" className="mt-5 text-sm leading-relaxed text-gold-light">{message || "手機版會直接開啟官方 LINE 並帶入內容；電腦版會複製訊息，方便貼到 LINE 傳送。"}</p>
      <button type="submit" className="mt-5 w-full rounded-full bg-gold px-6 py-4 text-base font-bold text-night-dark transition hover:bg-gold-light active:scale-[0.99]">
        送出需求 →
      </button>
      {desktopMessage && (
        <div className="mt-5 rounded-2xl border border-gold/30 bg-night-dark/45 p-4 text-left">
          <p className="text-sm font-bold text-paper">電腦版 LINE 提醒</p>
          <p className="mt-2 text-sm leading-7 text-paper/75">你的需求內容已複製到剪貼簿。請在手機開啟 LINE，傳送給官方帳號 <span className="font-semibold text-gold-light">@153yhemn</span>；手機版送出時會自動開啟對話並帶入內容。</p>
          <textarea readOnly value={desktopMessage} aria-label="已整理的聯絡需求內容" rows={6} className="mt-3 w-full resize-y rounded-xl border border-paper/15 bg-night-dark/60 p-3 text-xs leading-6 text-paper/75 outline-none" />
        </div>
      )}
    </form>
  );
}
