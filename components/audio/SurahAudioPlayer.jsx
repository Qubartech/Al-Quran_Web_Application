"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioProvider";
import { ALL_SURAHS } from "@/lib/surahMetadata";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Volume1,
  VolumeX,
  X,
  Repeat,
  Loader2,
  Languages,
  Check,
  Music,
  ExternalLink
} from "lucide-react";

function SurahAudioPlayer({
  src,
  playNext,
  playPrev,
  onClose,
  onPause,
  onPlay,
  title,
  playlistId,
  currentIndex,
  pauseTick,
  playTick,
  reciterName,
}) {
  const audioRef = useRef(null);
  const audioCtx = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState(-1);
  const [activeSurahNumber, setActiveSurahNumber] = useState(null);
  const [activeJuzId, setActiveJuzId] = useState(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Monitor Dark Mode class for styled custom slider tracks
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  }, []);

  // Restore user volume and speed settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedVol = localStorage.getItem("__audio_volume__");
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          setVolume(v);
          if (audioRef.current) audioRef.current.volume = v;
        }
        const savedMute = localStorage.getItem("__audio_muted__");
        if (savedMute !== null) {
          const m = savedMute === "true";
          setIsMuted(m);
          if (audioRef.current) audioRef.current.muted = m;
        }
        const savedSpeed = localStorage.getItem("__audio_speed__");
        if (savedSpeed !== null) {
          const s = parseFloat(savedSpeed);
          if (!isNaN(s) && s > 0) setPlaybackRate(s);
        }
      } catch (e) {}
    }
  }, []);

  // Sync playback speed from global context and events
  useEffect(() => {
    if (audioCtx?.playbackRate) {
      setPlaybackRate(audioCtx.playbackRate);
    }
  }, [audioCtx?.playbackRate]);

  useEffect(() => {
    const handleSpeedEvent = (e) => {
      if (typeof e.detail?.speed === "number") {
        setPlaybackRate(e.detail.speed);
      }
    };
    window.addEventListener("quran-audio-speed-change", handleSpeedEvent);
    return () => {
      window.removeEventListener("quran-audio-speed-change", handleSpeedEvent);
    };
  }, []);

  // Sync speed changes to native element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, src]);

  // Sync active ayah change event
  useEffect(() => {
    const handleAyahChange = (e) => {
      if (typeof e.detail?.ayahIndex === "number") {
        setActiveAyahIndex(e.detail.ayahIndex);
      }
      if (e.detail?.surahNumber) {
        setActiveSurahNumber(e.detail.surahNumber);
      }
      if (e.detail?.juzId) {
        setActiveJuzId(e.detail.juzId);
      }
    };
    window.addEventListener("quran-audio-ayah-change", handleAyahChange);
    return () => {
      window.removeEventListener("quran-audio-ayah-change", handleAyahChange);
    };
  }, []);

  const playPromiseRef = useRef(null);

  const safePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      const p = el.play();
      if (p && typeof p.catch === "function") {
        playPromiseRef.current = p;
        p.catch((err) => {
          if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
            // Ignore intentional abort/not-allowed errors during fast switching
          }
        });
      }
    } catch (e) {}
  };

  const safePause = () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            el.pause();
          })
          .catch(() => {
            el.pause();
          });
      } else {
        el.pause();
      }
    } catch (e) {}
  };

  // Reset state on src change, preserving pending seek time if present
  useEffect(() => {
    setActiveAyahIndex(-1);
    const pending = typeof window !== "undefined" ? window.pendingQuranAudioSeekTime : null;
    if (typeof pending === "number" && pending > 0) {
      setCurrentTime(pending);
    } else {
      setCurrentTime(0);
    }
    setDuration(0);
  }, [src]);

  // Seek listeners
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleSeek = (e) => {
      if (typeof e.detail.time === "number") {
        const targetTime = e.detail.time;
        if (audioEl.readyState < 1) {
          if (typeof window !== "undefined") {
            window.pendingQuranAudioSeekTime = targetTime;
          }
        } else {
          try {
            audioEl.currentTime = targetTime;
            setCurrentTime(targetTime);
          } catch (err) {}
        }
      }
    };

    window.addEventListener("quran-audio-seek", handleSeek);
    return () => {
      window.removeEventListener("quran-audio-seek", handleSeek);
    };
  }, [src]);

  // Execute pending seeks when metadata loads or audio can play
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleLoadedMetadata = () => {
      if (audioEl.duration) setDuration(audioEl.duration);
      if (
        typeof window !== "undefined" &&
        typeof window.pendingQuranAudioSeekTime === "number"
      ) {
        const seekTime = window.pendingQuranAudioSeekTime;
        window.pendingQuranAudioSeekTime = null;
        try {
          audioEl.currentTime = seekTime;
          setCurrentTime(seekTime);
        } catch (e) {}
      }
      safePlay();
    };

    audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioEl.addEventListener("canplay", handleLoadedMetadata);
    return () => {
      audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioEl.removeEventListener("canplay", handleLoadedMetadata);
    };
  }, [src]);

  // Play/pause controls from tick states
  useEffect(() => {
    if (!pauseTick) return;
    safePause();
  }, [pauseTick]);

  useEffect(() => {
    if (!playTick) return;
    safePlay();
  }, [playTick]);

  if (!src) return null;

  const showWordTooltip = audioCtx?.showWordTooltip ?? true;

  // Audio HTML5 Events
  const handleTimeUpdate = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (
      typeof window !== "undefined" &&
      typeof window.pendingQuranAudioSeekTime === "number" &&
      audioEl.currentTime === 0
    ) {
      return;
    }

    setCurrentTime(audioEl.currentTime);

    // Propagate custom timeupdate event for page verse highlights
    const event = new CustomEvent("quran-audio-timeupdate", {
      detail: { currentTime: audioEl.currentTime, duration: audioEl.duration },
    });
    window.dispatchEvent(event);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause?.();
  };

  const handleEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      playNext?.();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
    try {
      localStorage.setItem("__audio_volume__", v.toString());
      localStorage.setItem("__audio_muted__", (v === 0).toString());
    } catch (err) {}
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    if (audioRef.current) {
      audioRef.current.muted = newMute;
    }
    try {
      localStorage.setItem("__audio_muted__", newMute.toString());
    } catch (err) {}
  };

  const handleSeekChange = (e) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
    }
  };

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (audioCtx?.changeSpeed) {
      audioCtx.changeSpeed(rate);
    } else {
      try {
        localStorage.setItem("__audio_speed__", rate.toString());
      } catch (err) {}
      window.dispatchEvent(new CustomEvent("quran-audio-speed-change", { detail: { speed: rate } }));
    }
  };

  // Helper: format duration in mm:ss
  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const progressBarStyle = {
    background: fillGradient(progressPercent, isDark),
    accentColor: "#10b981",
  };

  const volumePercent = (isMuted ? 0 : volume) * 100;
  const volumeBarStyle = {
    background: fillGradient(volumePercent, isDark),
    accentColor: "#10b981",
  };

  function fillGradient(percent, darkTheme) {
    const bgTrack = darkTheme ? "rgba(51, 65, 85, 0.7)" : "rgba(203, 213, 225, 0.9)";
    return `linear-gradient(to right, #10b981 0%, #10b981 ${percent}%, ${bgTrack} ${percent}%, ${bgTrack} 100%)`;
  }

  // Determine playing surah number accurately
  const playingSurahNumber = (() => {
    if (activeSurahNumber) return activeSurahNumber;
    if (playlistId) {
      const s = String(playlistId).replace("surah_", "").trim();
      const num = parseInt(s, 10);
      if (!isNaN(num) && num > 0 && num <= 114) return num;
    }
    if (src) {
      const match = src.match(/\/(\d+)\.mp3/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > 0 && num <= 114) return num;
      }
    }
    return null;
  })();

  const resolvedSurahName = (() => {
    if (title && title !== "Surah Recitation" && title.trim() !== "") {
      return title;
    }
    if (playingSurahNumber) {
      const match = ALL_SURAHS.find((s) => s.number === playingSurahNumber);
      if (match) {
        return match.englishName;
      }
    }
    return "Surah Recitation";
  })();

  // Navigate or scroll strictly to the playing Surah's active verse
  const handleJumpToActiveVerse = () => {
    if (typeof window === "undefined") return;
    if (!playingSurahNumber) return;

    const currentAyahNum = activeAyahIndex >= 0 ? activeAyahIndex + 1 : 1;
    const currentPath = window.location.pathname;
    const isCurrentlyOnPlayingSurah = currentPath === `/surah/${playingSurahNumber}`;

    if (isCurrentlyOnPlayingSurah) {
      const targetEl = document.getElementById(`sura_${playingSurahNumber}_ayah_${currentAyahNum}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/surah/${playingSurahNumber}?ayah=${currentAyahNum}`);
        }
      }
    } else {
      window.location.href = `/surah/${playingSurahNumber}?ayah=${currentAyahNum}`;
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 transition-all duration-300 animate-fadeIn">
      
      {/* Outer Ambient Glowing Blur Orbs */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 rounded-3xl md:rounded-full blur-xl opacity-80 dark:opacity-60 pointer-events-none transition-all duration-500" />
      {isPlaying && (
        <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400/25 via-teal-400/20 to-emerald-500/25 rounded-3xl md:rounded-full blur-2xl opacity-90 animate-pulse pointer-events-none" />
      )}

      {/* Native HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        autoPlay
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {/* Floating Glassmorphic Capsule */}
      <div className="relative bg-white/85 dark:bg-slate-950/85 text-slate-900 dark:text-slate-100 border border-white/60 dark:border-emerald-500/30 backdrop-blur-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85)] ring-1 ring-slate-900/5 dark:ring-white/10 rounded-3xl md:rounded-full px-4 py-3 md:py-2.5 md:px-6 flex flex-col gap-2.5 md:gap-0 md:flex-row md:items-center md:justify-between transition-all">
        
        {/* Subtle Ambient Backlight Glow inside Capsule */}
        <div className="absolute -top-12 left-1/4 w-72 h-24 bg-emerald-500/20 dark:bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-72 h-20 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── 1. Track Info (Left) ── */}
        <div className="flex items-center justify-between md:justify-start min-w-0 md:max-w-[32%] md:flex-1 gap-3 z-10">
          <button
            type="button"
            onClick={handleJumpToActiveVerse}
            className="flex items-center min-w-0 group/track text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="Jump to active verse"
          >
            {/* Animated Audio Waveform Equalizer Icon */}
            <div className="flex items-end gap-0.5 h-6 w-6 mr-2.5 shrink-0 p-1 rounded-xl bg-emerald-50/90 dark:bg-emerald-500/15 border border-emerald-200/70 dark:border-emerald-500/30 shadow-2xs backdrop-blur-md">
              <span
                className={`w-1 bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all ${
                  isPlaying ? "animate-bounce [animation-delay:0ms] h-full" : "h-1 opacity-50"
                }`}
              />
              <span
                className={`w-1 bg-teal-500 dark:bg-teal-300 rounded-full transition-all ${
                  isPlaying ? "animate-bounce [animation-delay:150ms] h-3/4" : "h-1.5 opacity-50"
                }`}
              />
              <span
                className={`w-1 bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all ${
                  isPlaying ? "animate-bounce [animation-delay:300ms] h-full" : "h-1 opacity-50"
                }`}
              />
            </div>

            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white group-hover/track:text-emerald-600 dark:group-hover/track:text-emerald-400 transition-colors truncate">
                  {resolvedSurahName.includes("Ayah") || resolvedSurahName.includes(":")
                    ? resolvedSurahName
                    : `${resolvedSurahName} • Ayah ${activeAyahIndex >= 0 ? activeAyahIndex + 1 : "1"}`}
                </h4>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {reciterName || "Mishari Rashid al-`Afasy"}
              </p>
            </div>
          </button>

          {/* Mobile-only Close button */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ml-auto cursor-pointer"
            aria-label="Close audio player"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── 2. Playback Controls & Timeline (Center) ── */}
        <div className="flex flex-col items-center flex-1 w-full gap-1.5 md:gap-0.5 z-10">
          
          {/* Main Playback Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={playPrev}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Previous Ayah"
              title="Previous Ayah"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>

            {/* Glowing Tactical Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={18} />
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Next Ayah"
              title="Next Ayah"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>

          {/* Precision Seek Bar */}
          <div className="flex items-center w-full gap-2.5 text-[10.5px] md:text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="w-9 text-right select-none font-bold">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center h-3.5 group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                style={progressBarStyle}
                className="w-full h-1 group-hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400 audio-slider-input transition-all"
                aria-label="Seek progress"
              />
            </div>
            <span className="w-9 text-left select-none font-bold">{formatTime(duration)}</span>
          </div>
        </div>

        {/* ── 3. Action Tools: Repeat, Speed, Word Tooltips, Volume, Close (Right) ── */}
        <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 md:gap-3 shrink-0 z-10">
          
          <div className="flex items-center gap-1 md:gap-1.5">
            {/* Repeat/Loop */}
            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isLooping
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={isLooping ? "Repeat: ON" : "Repeat: OFF"}
              aria-label="Toggle repeat"
            >
              <Repeat size={14} className={isLooping ? "stroke-[2.5px]" : ""} />
            </button>

            {/* Word Meaning Tooltip Toggle */}
            <button
              type="button"
              onClick={audioCtx?.toggleWordTooltip}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                showWordTooltip
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30 shadow-2xs"
                  : "text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60"
              }`}
              title={showWordTooltip ? "Word Tooltips: ON" : "Word Tooltips: OFF"}
              aria-label="Toggle word meaning popup"
            >
              <Languages size={14} className={showWordTooltip ? "stroke-[2.5px]" : ""} />
            </button>

            {/* Speed Selector Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  playbackRate !== 1
                    ? "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80"
                }`}
                title="Playback speed"
                aria-label="Speed controls"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSpeedMenu(false)}
                  />
                  <div className="absolute bottom-9 right-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-2xl py-1.5 w-24 text-center">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => changeSpeed(rate)}
                        className={`w-full py-1.5 px-3 text-xs transition-colors cursor-pointer flex items-center justify-between font-bold ${
                          playbackRate === rate
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{rate}x</span>
                        {playbackRate === rate && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={15} />
                ) : volume < 0.5 ? (
                  <Volume1 size={15} />
                ) : (
                  <Volume2 size={15} />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={volumeBarStyle}
                className="w-12 md:w-16 h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:accent-emerald-400 audio-slider-input"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Desktop Close Button */}
          <div className="hidden md:flex items-center gap-1.5">
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Close Player"
              aria-label="Close audio player"
            >
              <X size={15} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SurahAudioPlayer;
