import type { Metadata } from "next";
import Image from "next/image";
import { DM_Mono, DM_Serif_Display } from "next/font/google";
import styles from "./pricing.module.css";
import QuoteCalculator from "@/components/pricing/QuoteCalculator";
import SocialIcon from "@/components/SocialIcon";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";
import {
  AI_CARDS,
  CHIPS,
  DESIGN_ROWS,
  ILLUSTRATION_CARDS,
  STEPS,
  TERMS,
  VIDEO_ADDONS,
  VIDEO_CARDS,
  VIDEO_PLANS,
} from "@/lib/data/pricing";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `服務報價 ｜ ${SITE.brand}`,
  description: "艾飛樂 Aifeiler 插畫、剪輯、設計服務報價單。",
};

function Row({
  label,
  sub,
  price,
  suffix,
}: {
  label: string;
  sub?: string;
  price: string;
  suffix?: string;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>
        {label}
        {sub && <small>{sub}</small>}
      </span>
      <span className={styles.rowPrice}>
        {price}
        {suffix && <small> {suffix}</small>}
      </span>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className={`${styles.page} ${dmSerif.variable} ${dmMono.variable}`}>
      <div className={styles.leader}>
        <div className={`${styles.wrap} ${styles.hero}`}>
          <div className={styles.heroTop}>
            <div>
              <div className={styles.eyebrow} style={{ marginBottom: 14 }}>
                SERVICE RATE CARD — 2026
              </div>
              <h1>
                插畫 <span>×</span> 剪輯 <span>×</span> 設計
                <br />
                一站服務報價
              </h1>
            </div>
            <div className={styles.heroArt}>
              <Image src={asset("/images/pricing-guide-cutout.webp")} alt="小艾介紹服務規劃" fill sizes="160px" />
            </div>
          </div>
          <p className={styles.heroSub}>
            語錄插畫、周邊設計、短影音剪輯、品牌視覺一手包辦。個人工作室接案，溝通直接、報價透明。
          </p>
          <div className={styles.metaLine}>
            2026 接案行情定價 · 報價公開無隱藏加購 · 初稿確認後免費修改 2 次
          </div>

          <div className={styles.chips}>
            {CHIPS.map((c) => (
              <div className={styles.chip} key={c.t}>
                <div className={styles.chipT}>{c.t}</div>
                <div className={styles.chipD}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sprockets} />
      </div>

      <div className={styles.body}>
        <section className={styles.svc}>
          <div className={styles.wrap}>
            <div className={styles.svcHead}>
              <div className={styles.eyebrow}>00 · INSTANT QUOTE</div>
              <h2>
                自動報價試算
                <span className={styles.badge}>免等待</span>
              </h2>
            </div>
            <p className={styles.svcIntro}>選擇需要的項目與數量，馬上看到預估報價，可直接透過 LINE 送出詢問。</p>
            <QuoteCalculator />
          </div>
        </section>

        <section className={styles.svc}>
          <div className={styles.wrap}>
            <div className={styles.svcHead}>
              <div className={styles.eyebrow}>01 · SERVICES — ILLUSTRATION &amp; QUOTES</div>
              <h2>
                插畫語錄設計
                <span className={styles.badge}>主力服務</span>
              </h2>
            </div>
            <p className={styles.svcIntro}>
              艾飛樂語錄的核心服務，從單張語錄圖卡到品牌 IP 角色、周邊與 LINE 貼圖，皆可客製。
            </p>

            {ILLUSTRATION_CARDS.map((card) => (
              <div className={styles.card} key={card.head}>
                <div className={styles.cardHead}>
                  <span>{card.head}</span>
                  <span className={styles.cardNote}>{card.note}</span>
                </div>
                {card.rows.map((r) => (
                  <Row key={r.label} {...r} />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.svc}>
          <div className={styles.wrap}>
            <div className={styles.svcHead}>
              <div className={styles.eyebrow}>02 · SERVICES — VIDEO EDITING</div>
              <h2>剪輯服務</h2>
            </div>
            <p className={styles.svcIntro}>
              適用 IG Reels、TikTok、YouTube Shorts 到長片，皆採單支計價；長期配合另有月方案優惠。
            </p>

            {VIDEO_CARDS.map((card) => (
              <div className={styles.card} key={card.head}>
                <div className={styles.cardHead}>
                  <span>{card.head}</span>
                  <span className={styles.cardNote}>{card.note}</span>
                </div>
                {card.rows.map((r) => (
                  <Row key={r.label} {...r} />
                ))}
              </div>
            ))}

            <div
              className={styles.cardHead}
              style={{ border: "1px solid var(--line)", borderBottom: "none", background: "var(--bg-card)" }}
            >
              <span>加購服務</span>
              <span className={styles.cardNote}>可單項加購，複數加購另有優惠</span>
            </div>
            <div className={styles.addonGrid}>
              {VIDEO_ADDONS.map((a) => (
                <div className={styles.addon} key={a.t}>
                  <div className={styles.addonT}>{a.t}</div>
                  <div className={styles.addonP}>{a.p}</div>
                </div>
              ))}
            </div>

            <div className={styles.plans}>
              {VIDEO_PLANS.map((plan) => (
                <div className={styles.plan} key={plan.title}>
                  <div className={styles.planH}>
                    <div className={styles.planT}>{plan.title}</div>
                    <div className={styles.planD}>{plan.desc}</div>
                  </div>
                  {plan.rows.map((r) => (
                    <Row key={r.label} {...r} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.svc}>
          <div className={styles.wrap}>
            <div className={styles.svcHead}>
              <div className={styles.eyebrow}>03 · SERVICES — GRAPHIC DESIGN</div>
              <h2>設計服務</h2>
              <div className={styles.swatches}>
                <div className={styles.swatch} style={{ background: "var(--forest)" }} />
                <div className={styles.swatch} style={{ background: "var(--accent)" }} />
                <div
                  className={styles.swatch}
                  style={{ background: "var(--bg-card-2)", border: "1px solid var(--line)" }}
                />
                <div className={styles.swatch} style={{ background: "var(--text)" }} />
              </div>
            </div>
            <p className={styles.svcIntro}>社群圖像到印刷物料，統一視覺風格，讓品牌形象更有記憶點。</p>

            <div className={styles.card}>
              {DESIGN_ROWS.map((r) => (
                <Row key={r.label} {...r} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.svc}>
          <div className={styles.wrap}>
            <div className={styles.svcHead}>
              <div className={styles.eyebrow}>04 · SERVICES — AI PIPELINE</div>
              <h2>
                AI 短影音方案
                <span className={styles.badge}>熱門推薦</span>
              </h2>
            </div>
            <p className={styles.svcIntro}>從分鏡、動畫生成到剪輯後製，三個階段可單獨委託，也可整合製作。</p>

            {AI_CARDS.map((card) => (
              <div className={styles.card} key={card.head}>
                <div className={styles.cardHead}>
                  <span>{card.head}</span>
                  <span className={styles.cardNote}>{card.note}</span>
                </div>
                {card.rows.map((r) => (
                  <Row key={r.label} {...r} />
                ))}
              </div>
            ))}

            <div className={styles.callout}>
              <div className={styles.calloutMark}>!</div>
              <div>
                AI 動畫會消耗大量生成點數，實際報價將依動畫複雜度、生成長度與生成次數調整，正式製作前會提供估價單確認。
              </div>
            </div>
          </div>
        </section>

        <section className={styles.svc}>
          <div className={styles.wrap}>
            <div className={styles.svcHead}>
              <div className={styles.eyebrow}>PROCESS &amp; TERMS</div>
              <h2>合作流程與收費說明</h2>
            </div>

            <div className={styles.steps}>
              {STEPS.map((s) => (
                <div className={styles.step} key={s.n}>
                  <div className={styles.stepN}>{s.n}</div>
                  <div className={styles.stepT}>{s.t}</div>
                  <div className={styles.stepD}>{s.d}</div>
                </div>
              ))}
            </div>

            <div className={styles.terms}>
              {TERMS.map((t) => (
                <div className={styles.term} key={t.k}>
                  <div className={styles.termK}>{t.k}</div>
                  <div className={styles.termV}>{t.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className={`${styles.leader} ${styles.foot}`}>
        <div className={styles.sprockets} />
        <div className={styles.wrap} style={{ paddingTop: 50 }}>
          <div className={styles.eyebrow}>GET IN TOUCH</div>
          <h2>讓你的內容，被看見</h2>
          <p className={styles.footSub}>歡迎私訊洽詢，可依品牌需求客製長期合作方案。</p>

          <div className={styles.contactGrid}>
            <a
              className={styles.contact}
              href={LINKS.instagramQuotes}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon type="instagram" className="h-[22px] w-[22px]" />
              <div>
                <div className={styles.cT}>Instagram</div>
                <div className={styles.cV}>aibi_0219</div>
              </div>
            </a>
            <a className={styles.contact} href={LINKS.youtube} target="_blank" rel="noopener noreferrer">
              <SocialIcon type="youtube" className="h-[22px] w-[22px]" />
              <div>
                <div className={styles.cT}>YouTube</div>
                <div className={styles.cV}>aibi_0219</div>
              </div>
            </a>
            <a className={styles.contact} href={LINKS.lineOA} target="_blank" rel="noopener noreferrer">
              <SocialIcon type="line" className="h-[22px] w-[22px]" />
              <div>
                <div className={styles.cT}>LINE</div>
                <div className={styles.cV}>@153yhemn</div>
              </div>
            </a>
          </div>

          <p className={styles.fine}>
            以上報價為 2026 年市場行情參考定價，實際費用依專案內容、素材完整度與交期彈性調整，正式合作以雙方確認之報價單為準。
          </p>
        </div>
        <div className={styles.sprockets} style={{ marginTop: 40 }} />
      </div>
    </div>
  );
}
