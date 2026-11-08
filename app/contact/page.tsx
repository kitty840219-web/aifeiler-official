import type { Metadata } from "next";
import Image from "next/image";
import ContactInquiryForm from "@/components/ContactInquiryForm";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: `聯絡我們 ｜ ${SITE.brand}`,
  description: "聯絡艾飛樂，洽談塔羅占卜、影片剪輯、平面設計、網站架設與客製化商品。",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>A NOTE TO AIFEILER</p>
        <div className={styles.art}><Image src={asset("/images/contact-collaboration-cutout.webp")} alt="小艾帶著筆記本，聆聽你的想法" fill priority sizes="120px" className="object-contain" /></div>
        <h1>讓想法，慢慢成形。</h1>
        <p className={styles.intro}>一份設計、一段故事，或一個還在發芽的點子。<br />歡迎寫給艾飛樂，我們一起聊聊。</p>
        <a className={styles.lineButton} href={LINKS.lineOA} target="_blank" rel="noopener noreferrer">直接用 LINE 聊聊 <span aria-hidden>↗</span></a>
        <p className={styles.handle}>官方帳號 @153yhemn</p>
      </header>

      <section className={styles.letter} aria-labelledby="inquiry-title">
        <div className={styles.letterHeading}>
          <span className={styles.eyebrow}>LET’S CREATE TOGETHER</span>
          <span className={styles.stamp} aria-hidden>✦<br />AIFEILER</span>
          <h2 id="inquiry-title">寫下你的需求</h2>
          <p>不必準備得很完整，從你的想法開始就好。<br />填好後，記得在 LINE 按下傳送。</p>
        </div>
        <ContactInquiryForm />
      </section>

      <section className={styles.details} aria-labelledby="studio-title">
        <p className={styles.eyebrow}>STUDIO INFORMATION</p>
        <h2 id="studio-title">與你保持聯繫</h2>
        <dl>
          <div><dt>服務地區</dt><dd>全台・線上洽談</dd></div>
          <div><dt>營業時間</dt><dd>週一至週五 09:00–18:00<br /><small>例假日及國定假日暫停服務</small></dd></div>
          <div><dt>工作室</dt><dd><a href="https://maps.app.goo.gl/aUxsuuSrxwXXYBRF9" target="_blank" rel="noopener noreferrer">艾飛樂數位文創個人工作室 ↗</a></dd></div>
        </dl>
        <a className={styles.review} href={LINKS.googleReviews} target="_blank" rel="noopener noreferrer">看看大家的 Google 評價 ↗</a>
      </section>
    </div>
  );
}
