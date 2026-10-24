"use client";

export default function ShortsCarousel({ videoIds }: { videoIds: string[] }) {
  return (
    <div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {videoIds.map((id) => (
          <div key={id} className="relative aspect-[9/16] w-36 shrink-0 snap-center overflow-hidden rounded-xl bg-black sm:w-40">
            <iframe
              title="艾飛樂真人 AI 短劇"
              src={`https://www.youtube.com/embed/${id}`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-paper/60">左右滑動查看更多短片 →</p>
    </div>
  );
}
