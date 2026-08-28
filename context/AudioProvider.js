"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { QURAN_API_BASE_URL, QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import getReciters, { FALLBACK_RECITERS } from "@/lib/api/getReciters";
import { ALL_SURAHS } from "@/lib/surahMetadata";
import SurahAudioPlayer from "@/components/audio/SurahAudioPlayer";

const AudioContext = createContext(null);

export function useAudio() {
  return useContext(AudioContext);
}

// Direct CDN URL helper for instant synchronous playback initialization
function getInitialReciterCdnUrl(reciterId, surahNumber) {
  const num = parseInt(surahNumber, 10);
  const numPad3 = String(num).padStart(3, "0");
  const rId = String(reciterId || "7");

  const reciterCdnMap = {
    "1": `${QURANICAUDIO_BASE_URL}/qdc/abdul_baset/mujawwad/${num}.mp3`,
    "2": `${QURANICAUDIO_BASE_URL}/qdc/abdul_baset/murattal/${num}.mp3`,
    "3": `${QURANICAUDIO_BASE_URL}/qdc/abdurrahmaan_as_sudais/murattal/${num}.mp3`,
    "4": `${QURANICAUDIO_BASE_URL}/qdc/abu_bakr_shatri/murattal/${num}.mp3`,
    "5": `${QURANICAUDIO_BASE_URL}/qdc/hani_ar_rifai/murattal/${num}.mp3`,
    "6": `${QURANICAUDIO_BASE_URL}/qdc/khalil_al_husary/murattal/${num}.mp3`,
    "7": `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${num}.mp3`,
    "8": `${QURANICAUDIO_BASE_URL}/quran/muhammad_siddeeq_al-minshaawee/${numPad3}.mp3`,
    "9": `${QURANICAUDIO_BASE_URL}/qdc/siddiq_minshawi/murattal/${num}.mp3`,
    "10": `${QURANICAUDIO_BASE_URL}/qdc/saud_ash-shuraym/murattal/${numPad3}.mp3`,
    "11": `${QURANICAUDIO_BASE_URL}/quran/abdul_muhsin_alqasim/${numPad3}.mp3`,
    "12": `${QURANICAUDIO_BASE_URL}/qdc/khalil_al_husary/muallim/${num}.mp3`,
  };

  return reciterCdnMap[rId] || `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${num}.mp3`;
}

function resolveSurahNumber(playlistId, src, optionalNum) {
  if (optionalNum) {
    const n = parseInt(optionalNum, 10);
    if (!isNaN(n) && n >= 1 && n <= 114) return n;
  }
  if (playlistId) {
    const s = String(playlistId).replace("surah_", "").trim();
    const n = parseInt(s, 10);
    if (!isNaN(n) && n >= 1 && n <= 114) return n;
  }
  if (src) {
    const match = src.match(/\/(\d+)\.mp3/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (!isNaN(n) && n >= 1 && n <= 114) return n;
    }
  }
  return null;
}

export default function AudioProvider({ children }) {
  const [src, setSrc] = useState("");
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [title, setTitle] = useState("");
  const [pauseTick, setPauseTick] = useState(0);
  const [playTick, setPlayTick] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const srcRef = useRef(src);
  const playlistIdRef = useRef(playlistId);
  const currentTimeRef = useRef(0);
  const reciterIdRef = useRef("7");

  // Dynamic reciter states
  const [reciters, setReciters] = useState(FALLBACK_RECITERS);
  const [reciterId, setReciterId] = useState("7");
  const [reciterName, setReciterName] = useState("Mishari Rashid al-`Afasy");

  useEffect(() => {
    srcRef.current = src;
  }, [src]);

  useEffect(() => {
    playlistIdRef.current = playlistId;
  }, [playlistId]);

  useEffect(() => {
    reciterIdRef.current = reciterId;
  }, [reciterId]);

  // Track playback time
  useEffect(() => {
    const handleTimeUpdate = (e) => {
      if (typeof e.detail?.currentTime === "number") {
        setCurrentTime(e.detail.currentTime);
        currentTimeRef.current = e.detail.currentTime;
      }
    };
    window.addEventListener("quran-audio-timeupdate", handleTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", handleTimeUpdate);
    };
  }, []);

  // Fetch reciters list from API on mount
  useEffect(() => {
    // Restore last audio on reload
    const last = typeof window !== "undefined" ? localStorage.getItem("__audio_src__") : null;
    if (last) {
      setSrc(last);
      setOpen(false);
    }

    const savedReciterId = typeof window !== "undefined" ? localStorage.getItem("app_reciter_id") || "7" : "7";
    setReciterId(savedReciterId);
    reciterIdRef.current = savedReciterId;

    getReciters().then((list) => {
      if (Array.isArray(list) && list.length > 0) {
        setReciters(list);
        const match = list.find((r) => String(r.id) === String(savedReciterId));
        if (match) {
          setReciterName(match.name || match.reciter_name);
        }
      }
    });
  }, []);

  // Update resolved reciter name based on active reciter ID
  useEffect(() => {
    const match = reciters.find((r) => String(r.id) === String(reciterId));
    if (match) {
      setReciterName(match.name || match.reciter_name);
    } else {
      setReciterName(reciterId === "7" ? "Mishari Rashid al-`Afasy" : `Reciter ${reciterId}`);
    }
  }, [reciterId, reciters]);

  const play = (newSrc) => {
    setSrc(newSrc);
    srcRef.current = newSrc;
    setOpen(true);
    setPaused(false);
    setPlaylist([]);
    setCurrentIndex(-1);
    setTitle("");
    setPlayTick((t) => t + 1);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_src__", newSrc || "");
      } catch (e) {}
    }
  };

  const playList = (list, startIdx = 0, listId = null, listTitle = "") => {
    if (!Array.isArray(list) || list.length === 0) return;
    setPlaylist(list);
    setPlaylistId(listId);
    playlistIdRef.current = listId;
    const idx = Math.max(0, Math.min(startIdx, list.length - 1));
    setCurrentIndex(idx);
    const nextSrc = list[idx];
    setSrc(nextSrc);
    srcRef.current = nextSrc;
    setOpen(true);
    setPaused(false);
    setTitle(listTitle || "");
    setPlayTick((t) => t + 1);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_src__", nextSrc || "");
      } catch (e) {}
    }
  };

  // Play a Surah by fetching its recitation URL dynamically based on active reciter
  const playSurah = useCallback(async (surahNumber, surahName = "", startSeekTime = 0, targetReciterId = null) => {
    const num = parseInt(surahNumber, 10);
    if (isNaN(num)) return;

    let resolvedTitle = surahName;
    if (!resolvedTitle || resolvedTitle === "Surah Recitation" || resolvedTitle.trim() === "") {
      const match = ALL_SURAHS.find((s) => s.number === num);
      if (match) resolvedTitle = match.englishName;
    }

    const currentReciter = String(
      targetReciterId ||
      reciterIdRef.current ||
      (typeof window !== "undefined" ? localStorage.getItem("app_reciter_id") : null) ||
      "7"
    );

    if (typeof window !== "undefined" && typeof startSeekTime === "number" && startSeekTime > 0) {
      window.pendingQuranAudioSeekTime = startSeekTime;
    }

    const initialUrl = getInitialReciterCdnUrl(currentReciter, num);
    currentTimeRef.current = startSeekTime;
    
    // Immediately start playback in user click gesture context
    playList([initialUrl], 0, `surah_${num}`, resolvedTitle);
  }, []);

  // Handle seamless reciter change with active playback instant hot-swapping
  const changeReciter = useCallback(async (newId, optionalSurahNumber = null) => {
    const stringId = String(newId);
    setReciterId(stringId);
    reciterIdRef.current = stringId;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("app_reciter_id", stringId);
        document.cookie = `__reciter_id__=${encodeURIComponent(stringId)}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {}
    }

    // Match reciter name
    const match = reciters.find((r) => String(r.id) === stringId);
    if (match) {
      setReciterName(match.name || match.reciter_name);
    }

    const surahNum = resolveSurahNumber(playlistIdRef.current, srcRef.current, optionalSurahNumber);

    if (surahNum) {
      const currentPos = currentTimeRef.current || 0;
      if (typeof window !== "undefined") {
        window.pendingQuranAudioSeekTime = currentPos;
      }

      const surahMatch = ALL_SURAHS.find((s) => s.number === surahNum);
      if (surahMatch) {
        setTitle(surahMatch.englishName);
      }

      // Instantly set the new CDN URL so audio switches immediately without interruption
      const initialUrl = getInitialReciterCdnUrl(stringId, surahNum);
      setSrc(initialUrl);
      srcRef.current = initialUrl;
      setOpen(true);
      setPaused(false);
      setPlaylistId(`surah_${surahNum}`);
      playlistIdRef.current = `surah_${surahNum}`;
      setPlayTick((t) => t + 1);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("__audio_src__", initialUrl);
        } catch (e) {}
      }
    }

    // Dispatch global event for other components (Ayah highlights, player page, etc.)
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("quran-reciter-change", { detail: { reciterId: stringId } })
      );
    }
  }, [reciters]);

  // Listen to external quran-reciter-change events (e.g. from settings or storage)
  useEffect(() => {
    const handleExternalReciterChange = (e) => {
      if (e.detail?.reciterId && String(e.detail.reciterId) !== String(reciterIdRef.current)) {
        const newId = String(e.detail.reciterId);
        setReciterId(newId);
        reciterIdRef.current = newId;
        const match = reciters.find((r) => String(r.id) === newId);
        if (match) {
          setReciterName(match.name || match.reciter_name);
        }
      }
    };
    window.addEventListener("quran-reciter-change", handleExternalReciterChange);
    return () => {
      window.removeEventListener("quran-reciter-change", handleExternalReciterChange);
    };
  }, [reciters]);

  const close = () => {
    setOpen(false);
    setPaused(false);
    setSrc("");
    srcRef.current = "";
    setPlaylist([]);
    setPlaylistId(null);
    playlistIdRef.current = null;
    setCurrentIndex(-1);
    setTitle("");
    setCurrentTime(0);
    currentTimeRef.current = 0;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("__audio_src__");
      } catch (e) {}
    }
  };

  const onEnded = () => {
    if (playlist.length > 0 && currentIndex >= 0) {
      const nextIdx = currentIndex + 1;
      if (nextIdx < playlist.length) {
        const nextSrc = playlist[nextIdx];
        setCurrentIndex(nextIdx);
        setSrc(nextSrc);
        srcRef.current = nextSrc;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("__audio_src__", nextSrc || "");
          } catch (e) {}
        }
        return;
      }
    }
    close();
  };

  const playPrev = () => {
    if (playlist.length > 0 && currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      const prevSrc = playlist[prevIdx];
      setCurrentIndex(prevIdx);
      setSrc(prevSrc);
      srcRef.current = prevSrc;
      setOpen(true);
      setPaused(false);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("__audio_src__", prevSrc || "");
        } catch (e) {}
      }
      return;
    }
    setOpen(true);
  };

  const pause = () => {
    setPaused(true);
    setPauseTick((t) => t + 1);
  };

  const resume = () => {
    if (!src) return;
    setPaused(false);
    setOpen(true);
    setPlayTick((t) => t + 1);
  };

  // Word tooltip toggle state
  const [showWordTooltip, setShowWordTooltip] = useState(true);

  // Synchronized playback rate state
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("__audio_speed__");
        if (saved !== null) {
          const s = parseFloat(saved);
          if (!isNaN(s) && s > 0) setPlaybackRate(s);
        }
      } catch (e) {}
    }
  }, []);

  const changeSpeed = useCallback((rate) => {
    const r = parseFloat(rate) || 1;
    setPlaybackRate(r);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_speed__", String(r));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent("quran-audio-speed-change", { detail: { speed: r } }));
    }
    const audioEl = document.querySelector("audio");
    if (audioEl) audioEl.playbackRate = r;
  }, []);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("__audio_show_word_tooltip__");
        if (saved !== null) {
          setShowWordTooltip(saved === "true");
        }
      } catch (e) {}
    }
  }, []);

  const toggleWordTooltip = () => {
    setShowWordTooltip((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("__audio_show_word_tooltip__", String(next));
        } catch (e) {}
      }
      return next;
    });
  };

  const value = {
    src,
    open,
    paused,
    currentTime,
    showWordTooltip,
    toggleWordTooltip,
    playbackRate,
    setPlaybackRate,
    changeSpeed,
    play,
    playList,
    playSurah,
    changeReciter,
    close,
    pause,
    resume,
    currentIndex,
    playlistId,
    reciterId,
    setReciterId,
    reciterName,
    reciters,
    title
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      {open && src ? (
        <SurahAudioPlayer
          src={src}
          playNext={onEnded}
          playPrev={playPrev}
          onClose={close}
          onPause={pause}
          onPlay={resume}
          title={title}
          playlistId={playlistId}
          currentIndex={currentIndex}
          pauseTick={pauseTick}
          playTick={playTick}
          reciterName={reciterName}
        />
      ) : null}
    </AudioContext.Provider>
  );
}
