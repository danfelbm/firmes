"use client";

import { useRef, useState } from "react";
import { Music, Pause, Play, X } from "lucide-react";
import { AUDIO_CALLE_URL } from "@/lib/constants";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioDock() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [minimized, setMinimized] = useState(false);

  // Guard: sin URL de audio no hay dock.
  if (!AUDIO_CALLE_URL) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <audio
        ref={audioRef}
        src={AUDIO_CALLE_URL}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />

      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex size-14 items-center justify-center rounded-full bg-yellow text-ink shadow-xl shadow-ink/25 transition-transform hover:-translate-y-0.5"
          aria-label="Abrir reproductor de CALLE"
        >
          <Music size={24} aria-hidden="true" />
        </button>
      ) : (
        <div className="w-[19rem] rounded-2xl border border-ink/10 bg-paper/95 p-4 shadow-2xl shadow-ink/25 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yellow text-ink transition-transform hover:scale-105"
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? (
                <Pause size={20} aria-hidden="true" />
              ) : (
                <Play size={20} className="ml-0.5" aria-hidden="true" />
              )}
            </button>
            <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
              CALLE{" "}
              <span className="font-medium text-muted">
                — la calle ya canta
              </span>
            </p>
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="shrink-0 text-muted transition-colors hover:text-ink"
              aria-label="Minimizar reproductor"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div
            className="mt-3 h-2 cursor-pointer overflow-hidden rounded-full bg-ink/10"
            onClick={seek}
            role="slider"
            aria-label="Progreso de la canción"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            tabIndex={0}
          >
            <div
              className="h-full rounded-full bg-yellow"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[0.7rem] font-medium text-muted">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
