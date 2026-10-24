import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Serif_TC, Noto_Sans_TC, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import MainWrapper from "@/components/MainWrapper";
import PageTransition from "@/components/PageTransition";
import EntryGate from "@/components/EntryGate";
import MeteorShower from "@/components/MeteorShower";
import StarField from "@/components/StarField";
import { LINKS, SITE } from "@/lib/data/site";
import { asset } from "@/lib/basePath";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { VIEW_MODE_INIT_SCRIPT } from "@/lib/viewMode";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ma-shan-zheng",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  verification: {
    google: "HIlZvTSxdy_jgOn7TJSAinN1u6BSojHTQw92r3y2K4s",
  },
  title: "艾飛樂數位文創個人工作室｜插畫・品牌視覺・客製周邊",
  description:
    "艾飛樂數位文創個人工作室提供插畫語錄、LINE 貼圖、社群視覺、品牌合作與客製周邊設計；由 Ivy 創作，歡迎透過官方 LINE 洽談合作。",
  alternates: { canonical: "/" },
  keywords: ["艾飛樂", "艾飛樂數位文創個人工作室", "插畫設計", "LINE貼圖設計", "社群視覺", "客製周邊", "品牌合作"],
  openGraph: {
    title: SITE.brandFull,
    description: SITE.description,
    images: [asset("/images/hero-cover.webp")],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSerifTC.variable} ${notoSansTC.variable} ${maShanZheng.variable}`}
    >
      <body className="site-shell mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-x-hidden bg-night-dark font-sans text-paper shadow-[0_0_60px_rgba(0,0,0,0.4)] antialiased">
        <Script id="local-business-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["ProfessionalService", "OnlineStore"],
            name: SITE.businessName,
            alternateName: [SITE.brand, SITE.brandEn],
            url: SITE.url,
            logo: `${SITE.url}images/hero-cover.webp`,
            image: `${SITE.url}images/hero-cover.webp`,
            description: "插畫語錄、LINE 貼圖、社群視覺、品牌合作與客製周邊設計。",
            telephone: SITE.telephone,
            email: LINKS.email,
            areaServed: { "@type": "Country", name: "台灣" },
            sameAs: [
              LINKS.instagramQuotes,
              LINKS.instagramIllustration,
              LINKS.instagramAbby,
              LINKS.youtube,
              LINKS.pro360,
            ],
            founder: { "@type": "Person", name: SITE.founder },
            knowsAbout: ["插畫設計", "LINE 貼圖設計", "社群視覺", "客製周邊", "品牌合作"],
          })}
        </Script>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Script id="view-mode-init" strategy="beforeInteractive">
          {VIEW_MODE_INIT_SCRIPT}
        </Script>
        <EntryGate />
        <StarField />
        <MeteorShower />
        <Navbar />
        <MainWrapper>
          <PageTransition>{children}</PageTransition>
        </MainWrapper>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
