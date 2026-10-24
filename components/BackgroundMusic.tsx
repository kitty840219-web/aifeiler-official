"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const PLAYLIST_IDS = [
  "2MH3zN3VCn4",
  "0OHbgy9fxE0",
  "oJJOO3oDEho",
  "vBNxKI8N85Q",
  "8N9fq_Rw3CE",
  "XfL0qZiWDJQ",
];
const DEFAULT_VOLUME = 8;
const VOLUME_KEY = "aifeiler.music.volume.v2";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  setShuffle: (shuffle: boolean) => void;
  setLoop: (loop: boolean) => void;
  playVideoAt: (index: number) => void;
  getPlaylistIndex: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { target: YTPlayer; data: number }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type Track = { title: string; author: string };

function BackgroundMusicInner() {
  const searchParams = useSearchParams();
  const embedded = searchParams.get("embed") === "1";
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [showVolume, setShowVolume] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showMv, setShowMv] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<YTPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const volumeRef = useRef(DEFAULT_VOLUME);

  useEffect(() => {
    if (embedded) return;
    try {
      const saved = window.localStorage.getItem(VOLUME_KEY);
      if (saved) {
        const v = Math.min(100, Math.max(0, parseInt(saved, 10)));
        if (!isNaN(v)) {
          volumeRef.current = v;
          queueMicrotask(() => setVolume(v));
        }
      }
    } catch {
      // localStorage unavailable, use default volume
    }
  }, [embedded]);

  useEffect(() => {
    if (embedded) return;
    let cancelled = false;
    Promise.all(
      PLAYLIST_IDS.map((id) =>
        fetch(`https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setTracks(
        results.map((data, i) => ({
          title: data && typeof data.title === "string" ? data.title : `曲目 ${i + 1}`,
          author: data && typeof data.author_name === "string" ? data.author_name : "",
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, [embedded]);

  useEffect(() => {
    if (embedded) return;

    function createPlayer() {
      if (playerRef.current || !mountRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: PLAYLIST_IDS[0],
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: PLAYLIST_IDS.slice(1).join(","),
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volumeRef.current);
            e.target.setShuffle(true);
            e.target.setLoop(true);
          },
          onStateChange: (e) => {
            const idx = e.target.getPlaylistIndex();
            if (idx >= 0) setCurrentIndex(idx);
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.getElementById("youtube-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    function startOnFirstInteraction() {
      if (startedRef.current) return;
      startedRef.current = true;
      setPlaying(true);
      playerRef.current?.playVideo();
      document.removeEventListener("click", startOnFirstInteraction);
      document.removeEventListener("touchstart", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
    }

    document.addEventListener("click", startOnFirstInteraction);
    document.addEventListener("touchstart", startOnFirstInteraction);
    document.addEventListener("keydown", startOnFirstInteraction);

    return () => {
      document.removeEventListener("click", startOnFirstInteraction);
      document.removeEventListener("touchstart", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
    };
  }, [embedded]);

  if (embedded) return null;

  function handleVolumeChange(v: number) {
    setVolume(v);
    volumeRef.current = v;
    playerRef.current?.setVolume(v);
    try {
      window.localStorage.setItem(VOLUME_KEY, String(v));
    } catch {
      // localStorage unavailable, skip persisting
    }
  }

  function handleListenTrack(index: number) {
    const player = playerRef.current;
    if (!player) return;
    player.setShuffle(false);
    player.setLoop(true);
    player.playVideoAt(index);
    startedRef.current = true;
    setPlaying(true);
    setCurrentIndex(index);
    setShowPlaylist(false);
  }

  function handleWatchTrack(index: number) {
    const player = playerRef.current;
    player?.pauseVideo();
    startedRef.current = true;
    setPlaying(false);
    setCurrentIndex(index);
    setShowPlaylist(true);
    setShowMv(true);
  }

  function handleCloseMv() {
    setShowMv(false);
    const player = playerRef.current;
    if (!player) return;
    player.setShuffle(false);
    player.setLoop(true);
    player.playVideoAt(currentIndex);
    startedRef.current = true;
    setPlaying(true);
  }

  return (
    <>
      <div ref={mountRef} className="pointer-events-none absolute h-px w-px opacity-0" aria-hidden />

      {showPlaylist && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[78vh] w-80 overflow-y-auto rounded-2xl border border-gold/30 bg-night p-2 shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-96">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold text-gold-light">播放清單</span>
            <button
              type="button"
              onClick={() => setShowPlaylist(false)}
              aria-label="關閉播放清單"
              className="flex h-6 w-6 items-center justify-center rounded-full text-paper/60 hover:text-paper"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {PLAYLIST_IDS.map((id, i) => {
              const isActive = i === currentIndex;
              const track = tracks[i];
              return (
                <li key={id}>
                  <div
                    className={`rounded-xl p-2 transition ${
                      isActive ? "bg-gold/15" : "hover:bg-night-light"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-night-light">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                        className={`block truncate text-xs font-semibold ${isActive ? "text-gold-light" : "text-paper"}`}
                        >{track?.title ?? `曲目 ${i + 1}`}</span>
                        {track?.author && <span className="block truncate text-[10px] text-paper/50">{track.author}</span>}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => handleListenTrack(i)} className="rounded-full border border-gold/35 px-3 py-1.5 text-xs font-bold text-gold-light transition hover:bg-gold hover:text-night-dark">♫ 只聽歌曲</button>
                      <button type="button" onClick={() => handleWatchTrack(i)} className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-night-dark transition hover:bg-gold-light">▶ 觀看 MV</button>
                    </div>
                    {isActive && showMv && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-gold/30 bg-black">
                        <div className="flex items-center justify-between bg-night-light px-3 py-2">
                          <span className="truncate pr-2 text-xs font-semibold text-paper">正在播放 MV</span>
                          <button type="button" onClick={handleCloseMv} className="shrink-0 rounded-full border border-gold/40 px-2.5 py-1 text-[10px] font-bold text-gold-light" aria-label="收起 MV 並繼續播放音樂">收起 MV ×</button>
                        </div>
                        <div className="aspect-video w-full">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                            title={track?.title ?? `艾飛樂動畫 MV ${i + 1}`}
                            className="h-full w-full"
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showVolume && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 flex h-28 w-8 flex-col items-center gap-2 rounded-full border border-gold/30 bg-night py-3 shadow-soft">
          <div className="flex h-20 w-8 shrink-0 items-center justify-center">
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              aria-label="調整音量"
              className="h-2 w-20 shrink-0 -rotate-90 cursor-pointer accent-gold"
            />
          </div>
          <span className="text-[10px] font-semibold text-gold-light">{volume}</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setShowPlaylist((v) => !v);
          setShowVolume(false);
        }}
        aria-label={showPlaylist ? "關閉播放清單" : "選擇歌曲"}
        aria-expanded={showPlaylist}
        className="flex h-9 w-8 items-center justify-center transition hover:bg-night-light"
      >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
            <path
              d="M4 6h11M4 12h11M4 18h6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="19" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M21.5 16V7l-3 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="h-5 w-px bg-gold/20" aria-hidden />
        <button
          type="button"
          onClick={() => {
            setShowVolume((v) => !v);
            setShowPlaylist(false);
          }}
          aria-label={showVolume ? "關閉音量調整" : "調整音量"}
          aria-expanded={showVolume}
          className="flex h-9 w-8 items-center justify-center transition hover:bg-night-light"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
            <path d="M4 7h10M4 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="16" cy="7" r="2" fill="currentColor" />
            <circle cx="12" cy="17" r="2" fill="currentColor" />
            <path d="M18 7h2M14 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span className="h-5 w-px bg-gold/20" aria-hidden />
        <button
          type="button"
          onClick={() => {
            startedRef.current = true;
            setPlaying((p) => {
              const next = !p;
              if (next) playerRef.current?.playVideo();
              else playerRef.current?.pauseVideo();
              return next;
            });
          }}
          aria-label={playing ? "關閉背景音樂" : "播放背景音樂"}
          className="flex h-9 w-9 items-center justify-center rounded-r-full transition hover:bg-night-light"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
              <path d="M16 8l4 8M20 8l-4 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
              <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
              <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>
    </>
  );
}

export default function BackgroundMusic() {
  return (
    <Suspense fallback={null}>
      <BackgroundMusicInner />
    </Suspense>
  );
}
