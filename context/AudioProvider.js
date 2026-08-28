"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { QURAN_API_BASE_URL, QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import getReciters, { FALLBACK_RECITERS } from "@/lib/api/getReciters";
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
    "8": `${QURANICAUDIO_BASE_URL}/qdc/siddiq_al-minshawi/mujawwad/${numPad3}.mp3`,
    "9": `${QURANICAUDIO_BASE_URL}/qdc/siddiq_minshawi/murattal/${num}.mp3`,
    "10": `${QURANICAUDIO_BASE_URL}/qdc/saud_ash-shuraym/murattal/${numPad3}.mp3`,
    "11": `${QURANICAUDIO_BASE_URL}/quran/abdul_muhsin_alqasim/${numPad3}.mp3`,
    "12": `${QURANICAUDIO_BASE_URL}/qdc/khalil_al_husary/muallim/${num}.mp3`,
  };

  return reciterCdnMap[rId] || `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${num}.mp3`;
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
  const currentTimeRef = useRef(0);

  // Dynamic reciter states
  const [reciters, setReciters] = useState(FALLBACK_RECITERS);
  const [reciterId, setReciterId] = useState("7");
  const [reciterName, setReciterName] = useState("Mishari Rashid al-`Afasy");

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
    const idx = Math.max(0, Math.min(startIdx, list.length - 1));
    setCurrentIndex(idx);
    const nextSrc = list[idx];
    setSrc(nextSrc);
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

    const currentReciter = String(
      targetReciterId ||
      reciterId ||
      (typeof window !== "undefined" ? localStorage.getItem("app_reciter_id") : null) ||
      "7"
    );

    if (typeof window !== "undefined" && typeof startSeekTime === "number" && startSeekTime > 0) {
      window.pendingQuranAudioSeekTime = startSeekTime;
    }

    const initialUrl = getInitialReciterCdnUrl(currentReciter, num);
    currentTimeRef.current = startSeekTime;
    
    // Immediately start playback in user click gesture context
    playList([initialUrl], 0, `surah_${num}`, surahName);

    // Fetch API asynchronously in background to sync official CDN URL if different
    try {
      const res = await fetch(`${QURAN_API_BASE_URL}/chapter_recitations/${currentReciter}/${num}`);
      if (res.ok) {
        const data = await res.json();
        const apiAudioUrl = data.audio_file?.audio_url;
        if (apiAudioUrl && apiAudioUrl !== initialUrl) {
          const targetSeek = currentTimeRef.current > 0 ? currentTimeRef.current : startSeekTime;
          if (typeof window !== "undefined" && targetSeek > 0) {
            window.pendingQuranAudioSeekTime = targetSeek;
          }
          setSrc(apiAudioUrl);
        }
      }
    } catch (e) {
      console.error("Failed to fetch recitation from API:", e);
    }
  }, [reciterId]);

  // Handle seamless reciter change with active playback hot-swapping
  const changeReciter = useCallback(async (newId) => {
    const stringId = String(newId);
    setReciterId(stringId);

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

    // If a Surah is currently playing or open in the player, hot-swap the audio source
    if (playlistId) {
      let surahNum = null;
      if (typeof playlistId === "string" && playlistId.startsWith("surah_")) {
        surahNum = parseInt(playlistId.replace("surah_", ""), 10);
      } else if (!isNaN(Number(playlistId))) {
        surahNum = parseInt(playlistId, 10);
      }

      if (surahNum) {
        const currentPos = currentTimeRef.current || currentTime || 0;
        if (typeof window !== "undefined") {
          window.pendingQuranAudioSeekTime = currentPos;
        }

        // Fetch new audio URL for the new reciter
        try {
          const res = await fetch(`${QURAN_API_BASE_URL}/chapter_recitations/${stringId}/${surahNum}`);
          if (res.ok) {
            const data = await res.json();
            const apiAudioUrl = data.audio_file?.audio_url;
            if (apiAudioUrl) {
              setSrc(apiAudioUrl);
              setPaused(false);
              setPlayTick((t) => t + 1);
            } else {
              const fallbackUrl = getInitialReciterCdnUrl(stringId, surahNum);
              setSrc(fallbackUrl);
              setPaused(false);
              setPlayTick((t) => t + 1);
            }
          } else {
            const fallbackUrl = getInitialReciterCdnUrl(stringId, surahNum);
            setSrc(fallbackUrl);
            setPaused(false);
            setPlayTick((t) => t + 1);
          }
        } catch (e) {
          const fallbackUrl = getInitialReciterCdnUrl(stringId, surahNum);
          setSrc(fallbackUrl);
        }
      }
    }

    // Dispatch global event for other components to react
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("quran-reciter-change", { detail: { reciterId: stringId } })
      );
    }
  }, [playlistId, currentTime, reciters]);

  // Listen to external quran-reciter-change events (e.g. from settings or storage)
  useEffect(() => {
    const handleExternalReciterChange = (e) => {
      if (e.detail?.reciterId && String(e.detail.reciterId) !== String(reciterId)) {
        const newId = String(e.detail.reciterId);
        setReciterId(newId);
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
  }, [reciterId, reciters]);

  const close = () => {
    setOpen(false);
    setPaused(false);
    setSrc("");
    setPlaylist([]);
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
