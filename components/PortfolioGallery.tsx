import CanvaPortfolioReader from "@/components/CanvaPortfolioReader";

export default function PortfolioGallery() {
  return (
    <section id="portfolio-book" className="scroll-mt-24 bg-[#fdf9f0] px-3 pb-14 pt-4 sm:px-8 sm:pb-20 sm:pt-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="sr-only">翻閱我的作品集</h2>
        <CanvaPortfolioReader />
      </div>
    </section>
  );
}
