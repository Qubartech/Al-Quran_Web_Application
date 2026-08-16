"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioProvider";
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
  Languages
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
          setPlaybackRate(s);
        }
      } catch (e) {
        // ignore storage errors
      }
    }
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

  // Execute pending seeks when metadata loads or audio starts playing
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
    };

    audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioEl.addEventListener("canplay", handleLoadedMetadata);
    audioEl.addEventListener("play", handleLoadedMetadata);
    return () => {
      audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioEl.removeEventListener("canplay", handleLoadedMetadata);
      audioEl.removeEventListener("play", handleLoadedMetadata);
    };
  }, [src]);

  // Play/pause controls from tick states
  useEffect(() => {
    if (!pauseTick) return;
    try {
      audioRef.current?.pause?.();
    } catch (e) {}
  }, [pauseTick]);

  useEffect(() => {
    if (!playTick) return;
    try {
      audioRef.current?.play?.();
    } catch (e) {}
  }, [playTick]);

  if (!src) return null;

  const audioCtx = useAudio();
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
      detail: { currentTime: audioEl.currentTime },
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
    try {
      localStorage.setItem("__audio_speed__", rate.toString());
    } catch (err) {}
  };

  // Helper: format duration in mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
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
    const bgTrack = darkTheme ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.8)";
    return `linear-gradient(to right, #10b981 0%, #10b981 ${percent}%, ${bgTrack} ${percent}%, ${bgTrack} 100%)`;
  }

  // Determine playing surah number accurately
  const playingSurahNumber = (() => {
    if (activeSurahNumber) return activeSurahNumber;
    if (!playlistId) return null;
    const s = String(playlistId).replace("surah_", "").trim();
    const num = parseInt(s, 10);
    return !isNaN(num) && num > 0 && num <= 114 ? num : null;
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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50 transition-all duration-300">
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

      {/* Floating Glassmorphic Player Card */}
      <div className="bg-slate-900/95 text-slate-100 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl shadow-black/50 rounded-2xl md:rounded-full px-4 py-3 md:py-2.5 md:px-6 relative flex flex-col gap-2.5 md:gap-0 md:flex-row md:items-center md:justify-between transition-all">
        
        {/* 1. Track Info (Click to jump to active verse) */}
        <div className="flex items-center justify-between md:justify-start min-w-0 md:w-[30%] gap-3">
          
          <button
            onClick={handleJumpToActiveVerse}
            className="flex items-center min-w-0 group/track text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to go to currently playing verse"
          >
            {/* Animated Equalizer Wave */}
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4 w-4 mr-2.5 flex-shrink-0">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full"></span>
                <span className="w-1 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.15s] h-3"></span>
                <span className="w-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.45s] h-4"></span>
              </div>
            ) : (
              <div className="flex items-end gap-0.5 h-4 w-4 mr-2.5 flex-shrink-0 opacity-40">
                <span className="w-1 bg-emerald-400 rounded-full h-1"></span>
                <span className="w-1 bg-teal-300 rounded-full h-1.5"></span>
                <span className="w-1 bg-emerald-500 rounded-full h-1"></span>
              </div>
            )}

            <div className="min-w-0 flex flex-col">
              <h4 className="text-xs md:text-sm font-bold text-white group-hover/track:text-emerald-400 transition-colors truncate">
                {title
                  ? `${title} • Ayah ${
                      activeAyahIndex >= 0 ? activeAyahIndex + 1 : "1"
                    }`
                  : "Surah Recitation"}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {reciterName || "Mishary Rashid Alafasy"}
              </p>
            </div>
          </button>

          {/* Mobile-only Close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all ml-auto"
            aria-label="Close audio player"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Controls & Seek Bar */}
        <div className="flex flex-col items-center flex-1 w-full gap-1.5 md:gap-0.5">
          {/* Controls Buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Skip Previous */}
            <button
              onClick={playPrev}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Previous Ayah"
            >
              <SkipBack size={17} fill="currentColor" />
            </button>

            {/* Main Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-11 h-11 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all duration-200 flex-shrink-0 cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={19} />
              ) : isPlaying ? (
                <Pause size={19} fill="currentColor" />
              ) : (
                <Play size={19} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={playNext}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Next Ayah"
            >
              <SkipForward size={17} fill="currentColor" />
            </button>
          </div>

          {/* Progress Slider (current/total times + slider bar) */}
          <div className="flex items-center w-full gap-2.5 text-[10px] md:text-xs font-mono text-slate-400">
            <span className="w-9 text-right select-none">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center h-4 group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                style={progressBarStyle}
                className="w-full h-1 group-hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 audio-slider-input transition-all"
                aria-label="Seek progress"
              />
            </div>
            <span className="w-9 text-left select-none">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 3. Right Controls: Loop, Speed, Word popup, Volume, Close */}
        <div className="flex items-center justify-between md:justify-end gap-3 md:w-[30%]">
          
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Repeat/Loop */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isLooping
                  ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={isLooping ? "Repeat: ON" : "Repeat: OFF"}
              aria-label="Toggle repeat"
            >
              <Repeat size={14} className={isLooping ? "stroke-[2.5px]" : ""} />
            </button>

            {/* Word Meaning Tooltip Toggle */}
            <button
              onClick={audioCtx?.toggleWordTooltip}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                showWordTooltip
                  ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 opacity-60"
              }`}
              title={showWordTooltip ? "Word Tooltips: ON (Click to Disable)" : "Word Tooltips: OFF (Click to Enable)"}
              aria-label="Toggle word meaning popup"
            >
              <Languages size={14} className={showWordTooltip ? "stroke-[2.5px]" : ""} />
            </button>

            {/* Playback speed menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  playbackRate !== 1
                    ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30"
                    : "text-slate-300 hover:bg-slate-800 border border-slate-700/60"
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
                  <div className="absolute bottom-9 right-0 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 w-24 text-center">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        className={`block w-full py-1.5 px-3 text-xs hover:bg-slate-800 transition-colors cursor-pointer ${
                          playbackRate === rate
                            ? "font-bold text-emerald-400 bg-emerald-500/10"
                            : "text-slate-300"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-1 group/volume">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                className="w-12 md:w-16 h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 audio-slider-input"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Desktop-only Separator & Close button */}
          <div className="hidden md:flex items-center gap-1.5">
            <div className="h-5 w-px bg-slate-800 mx-0.5" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
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
