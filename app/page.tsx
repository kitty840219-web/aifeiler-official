import AboutPage from "./about/page";
import { SITE } from "@/lib/data/site";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        {SITE.businessName}｜插畫、品牌視覺、LINE 貼圖與客製周邊設計
      </h1>
      <AboutPage />
    </>
  );
}
