"use client";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

function SurahAudioPlayer({
  src,
  playNext,
  playPrev,
  onClose,
  onPause,
  onPlay,
  title,
  currentIndex,
  pauseTick,
  playTick,
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
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
      if (typeof e.detail.ayahIndex === "number") {
        setActiveAyahIndex(e.detail.ayahIndex);
      }
    };
    window.addEventListener("quran-audio-ayah-change", handleAyahChange);
    return () => {
      window.removeEventListener("quran-audio-ayah-change", handleAyahChange);
    };
  }, []);

  // Reset state on src change
  useEffect(() => {
    setActiveAyahIndex(-1);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  // Seek listeners
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleSeek = (e) => {
      if (typeof e.detail.time === "number") {
        if (audioEl.readyState < 1) {
          if (typeof window !== "undefined") {
            window.pendingQuranAudioSeekTime = e.detail.time;
          }
        } else {
          audioEl.currentTime = e.detail.time;
        }
      }
    };

    window.addEventListener("quran-audio-seek", handleSeek);
    return () => {
      window.removeEventListener("quran-audio-seek", handleSeek);
    };
  }, [src]);

  // Execute pending seeks when metadata loads
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleLoadedMetadata = () => {
      setDuration(audioEl.duration);
      if (
        typeof window !== "undefined" &&
        typeof window.pendingQuranAudioSeekTime === "number"
      ) {
        audioEl.currentTime = window.pendingQuranAudioSeekTime;
        window.pendingQuranAudioSeekTime = null;
      }
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

  // Audio HTML5 Events
  const handleTimeUpdate = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
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
  };

  const volumePercent = (isMuted ? 0 : volume) * 100;
  const volumeBarStyle = {
    background: fillGradient(volumePercent, isDark),
  };

  function fillGradient(percent, darkTheme) {
    const bgTrack = darkTheme ? "rgba(75, 85, 99, 0.4)" : "rgba(226, 232, 240, 0.8)";
    return `linear-gradient(to right, #10b981 0%, #10b981 ${percent}%, ${bgTrack} ${percent}%, ${bgTrack} 100%)`;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 transition-all duration-300">
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
      <div className="glass backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-800/60 shadow-2xl rounded-2xl md:rounded-full px-4 py-3.5 md:py-3 md:px-6 relative flex flex-col gap-3 md:gap-0 md:flex-row md:items-center md:justify-between">
        
        {/* 1. Mobile Top Row / Desktop Left Side: Info */}
        <div className="flex items-center justify-between md:justify-start min-w-0 md:w-[28%]">
          <div className="flex items-center min-w-0">
            {/* Animated visualizer wave */}
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4 w-5 mr-3 flex-shrink-0">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            ) : (
              <div className="flex items-end gap-0.5 h-4 w-5 mr-3 flex-shrink-0 opacity-30">
                <span className="wave-bar [animation-play-state:paused] scale-y-[0.2]"></span>
                <span className="wave-bar [animation-play-state:paused] scale-y-[0.2]"></span>
                <span className="wave-bar [animation-play-state:paused] scale-y-[0.2]"></span>
                <span className="wave-bar [animation-play-state:paused] scale-y-[0.2]"></span>
              </div>
            )}

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {title
                  ? `${title} - Ayah ${
                      activeAyahIndex >= 0 ? activeAyahIndex + 1 : "1"
                    }`
                  : "Surah Recitation"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Mishari bin Rashid Alafasy
              </p>
            </div>
          </div>

          {/* Mobile-only Close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-slate-655 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Close audio player"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Mobile Center / Desktop Center: Playback Controls & Seek Bar */}
        <div className="flex flex-col items-center flex-1 w-full gap-1.5 md:gap-1">
          {/* Controls Buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Skip Previous */}
            <button
              onClick={playPrev}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Previous Ayah"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            {/* Main Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20 hover:scale-105 transition-all duration-200 flex-shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={playNext}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Next Ayah"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          {/* Progress Slider (current/total times + slider bar) */}
          <div className="flex items-center w-full gap-2.5 text-[10px] md:text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="w-8 text-right select-none">{formatTime(currentTime)}</span>
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
            <span className="w-8 text-left select-none">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 3. Mobile Bottom Row / Desktop Right Side: Loop, Speed, Volume, Close */}
        <div className="flex items-center justify-between md:justify-end gap-3 md:w-[28%]">
          
          {/* Audio Adjustments Panel */}
          <div className="flex items-center gap-2 md:gap-2.5">
            {/* Repeat/Loop */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-full transition-all ${
                isLooping
                  ? "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20"
                  : "text-slate-400 hover:text-slate-655 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title="Repeat Surah/Verse"
              aria-label="Toggle repeat"
            >
              <Repeat size={15} className={isLooping ? "stroke-[2.5px]" : ""} />
            </button>

            {/* Playback speed menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-md transition-all ${
                  playbackRate !== 1
                    ? "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  <div className="absolute bottom-9 right-0 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 w-24 text-center">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        className={`block w-full py-1.5 px-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                          playbackRate === rate
                            ? "font-bold text-emerald-500 bg-emerald-500/5"
                            : "text-slate-700 dark:text-slate-300"
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
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
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
                className="w-14 md:w-18 h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500 audio-slider-input"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Desktop-only Separator & Close button */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-655 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
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
