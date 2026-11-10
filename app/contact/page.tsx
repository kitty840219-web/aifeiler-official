import type { Metadata } from "next";
import Image from "next/image";
import ContactInquiryForm from "@/components/ContactInquiryForm";
import GoogleReviews from "@/components/GoogleReviews";
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
        <div className={styles.art}><Image src={asset("/images/contact/contact-collaboration-cutout.webp")} alt="小艾帶著筆記本，聆聽你的想法" fill priority sizes="120px" className="object-contain" /></div>
        <h1><span className={styles.titleLine}>與我聯絡</span><span className={styles.titleLine}>讓想法，慢慢成形。</span></h1>
        <p className={styles.intro}>一份設計、一段故事，或一個還在發芽的點子。<br />歡迎寫給艾飛樂，我們一起聊聊。</p>

      </header>

      <section className={styles.letter} aria-labelledby="inquiry-title">
        <div className={styles.letterHeading}>
          <span className={styles.eyebrow}>LET’S CREATE TOGETHER</span>
          <a className={styles.lineQr} href={LINKS.lineOA} target="_blank" rel="noopener noreferrer" aria-label="掃描 QR code 或點擊加入艾飛樂官方 LINE">
            <Image src={asset("/images/contact/line-official-qrcode.webp")} alt="艾飛樂官方 LINE QR code" width={540} height={540} sizes="180px" />
          </a>
          <p className={styles.qrCaption}>掃描或點擊加入官方 LINE<br /><span>@153yhemn</span></p>
          <div className={styles.lineContact}>
            <a className={styles.lineButton} href={LINKS.lineOA} target="_blank" rel="noopener noreferrer">直接用 LINE 聊聊 <span aria-hidden>↗</span></a>
            <p className={styles.handle}>官方帳號 @153yhemn</p>
          </div>
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
        </dl>
        <div className={styles.mapCard}>
          <div className={styles.mapHeading}>
            <p className={styles.eyebrow}>FIND US ON GOOGLE</p>
            <h3>艾飛樂數位文創個人工作室</h3>
            <p>全台服務・歡迎透過 LINE 預約洽談</p>
          </div>
          <iframe
            title="艾飛樂數位文創個人工作室 Google 地圖"
            src={LINKS.googleMapsEmbed}
            width="600"
            height="320"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.mapFrame}
          />
          <div className={styles.mapActions}>
            <a href={LINKS.googleMaps} target="_blank" rel="noopener noreferrer">在 Google 地圖開啟 ↗</a>
            <a href={LINKS.googleReviews} target="_blank" rel="noopener noreferrer">查看 Google 評價 ↗</a>
          </div>
        </div>
        <GoogleReviews />
      </section>
    </div>
  );
}
