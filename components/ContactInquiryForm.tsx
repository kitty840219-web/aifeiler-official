"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/contact/contact.module.css";

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
  return <label htmlFor={id} className={styles.option}>
    <input id={id} name={name} type="checkbox" value={label} />
    <span>{label}</span>
  </label>;
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
    <form onSubmit={submitInquiry} className={styles.form}>
      <fieldset>
        <legend><span>01</span> 關於你</legend>
        <p className={styles.hint}>標示 * 為必填，讓我們知道如何聯絡你。</p>
        <div className={styles.fields}>
          <label>姓名 <span>*</span><input required name="name" autoComplete="name" placeholder="你的名字" /></label>
          <label>電子信箱 <span>*</span><input required name="email" type="email" autoComplete="email" placeholder="hello@example.com" /></label>
          <label>聯絡電話 <span>*</span><input required name="phone" type="tel" autoComplete="tel" placeholder="方便聯絡的電話" /></label>
          <label>LINE ID <small>選填</small><input name="lineId" placeholder="你的 LINE ID" /></label>
        </div>
      </fieldset>
      <fieldset>
        <legend><span>02</span> 方便聯絡的時間</legend>
        <p className={styles.hint}>可複選；假日時段將另行確認安排。</p>
        <div className={styles.options}>
          {contactTimes.map((item, index) => <CheckOption key={item} id={`time-${index}`} name="contactTime" label={item} />)}
        </div>
      </fieldset>
      <fieldset>
        <legend><span>03</span> 想一起完成什麼？</legend>
        <p className={styles.hint}>選擇需要的服務，可複選。</p>
        <div className={styles.options}>
          {serviceTypes.map((item, index) => <CheckOption key={item} id={`service-${index}`} name="serviceType" label={item} />)}
        </div>
        <label className={styles.description}>再多說一點 <small>選填</small>
          <textarea name="details" rows={5} placeholder="聊聊你的想法、喜歡的風格、預計完成時間，或貼上參考連結…" />
        </label>
      </fieldset>
      <div className={styles.send}>
        <p aria-live="polite">{message || "手機會開啟 LINE 並帶入內容；電腦會整理訊息，請複製後貼到 LINE 傳送。"}</p>
        <button type="submit">整理需求，前往 LINE <span aria-hidden>↗</span></button>
        <small>開啟 LINE 後，請確認內容並按下傳送。</small>
      </div>
      {desktopMessage && <div className={styles.preview}>
        <h3>你的需求已整理好</h3>
        <p>請複製下方內容，貼到官方 LINE @153yhemn 並傳送。</p>
        <textarea readOnly value={desktopMessage} aria-label="已整理的聯絡需求內容" rows={8} />
        <a href="https://line.me/R/ti/p/@153yhemn" target="_blank" rel="noopener noreferrer">開啟官方 LINE ↗</a>
      </div>}
    </form>
  );
}
