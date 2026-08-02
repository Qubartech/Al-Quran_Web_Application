"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { QURAN_API_BASE_URL, QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import SurahAudioPlayer from "@/components/audio/SurahAudioPlayer";

const AudioContext = createContext(null);

export function useAudio() {
  return useContext(AudioContext);
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
  const [reciters, setReciters] = useState([]);
  const [reciterName, setReciterName] = useState("Mishary Rashid Alafasy");

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

  useEffect(() => {
    // Restore last audio on reload
    const last = typeof window !== "undefined" ? localStorage.getItem("__audio_src__") : null;
    if (last) {
      setSrc(last);
      setOpen(false);
    }

    // Fetch reciters list to get the name of the selected reciter
    fetch(`${QURAN_API_BASE_URL}/resources/recitations?language=en`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.recitations) {
          setReciters(data.recitations);
        }
      })
      .catch((e) => console.error("Error fetching reciters for names:", e));
  }, []);

  // Update resolved reciter name based on active reciter ID
  useEffect(() => {
    const savedId = typeof window !== "undefined" ? localStorage.getItem("app_reciter_id") || "7" : "7";
    const match = reciters.find((r) => String(r.id) === String(savedId));
    if (match) {
      const name = match.translated_name?.name || match.reciter_name;
      const style = match.style ? ` (${match.style})` : "";
      setReciterName(`${name}${style}`);
    } else {
      setReciterName(savedId === "7" ? "Mishary Rashid Alafasy" : `Reciter ${savedId}`);
    }
  }, [reciters, src]);

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
    currentTimeRef.current = 0;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_src__", nextSrc || "");
      } catch (e) {}
    }
  };

  // Play a Surah by fetching its recitation URL dynamically based on current reciter
  const playSurah = async (surahNumber, surahName = "", startSeekTime = 0) => {
    const num = parseInt(surahNumber, 10);
    if (isNaN(num)) return;

    if (typeof window !== "undefined" && typeof startSeekTime === "number" && startSeekTime > 0) {
      window.pendingQuranAudioSeekTime = startSeekTime;
    }

    let reciterId = "7";
    if (typeof window !== "undefined") {
      reciterId = localStorage.getItem("app_reciter_id") || "7";
    }

    // Direct CDN URL mapping for instant synchronous playback inside user gesture
    const reciterCdnMap = {
      "1": `${QURANICAUDIO_BASE_URL}/qdc/abdul_baset/mujawwad/${num}.mp3`,
      "2": `${QURANICAUDIO_BASE_URL}/qdc/abdul_baset/murattal/${num}.mp3`,
      "3": `${QURANICAUDIO_BASE_URL}/qdc/abu_bakr_shatri/murattal/${num}.mp3`,
      "4": `${QURANICAUDIO_BASE_URL}/qdc/hani_ar_rifai/murattal/${num}.mp3`,
      "5": `${QURANICAUDIO_BASE_URL}/qdc/khalil_al_husary/murattal/${num}.mp3`,
      "6": `${QURANICAUDIO_BASE_URL}/qdc/siddiq_minshawi/murattal/${num}.mp3`,
      "7": `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${num}.mp3`,
      "8": `${QURANICAUDIO_BASE_URL}/qdc/saud_ash_shuraym/murattal/${num}.mp3`,
      "9": `${QURANICAUDIO_BASE_URL}/qdc/siddiq_minshawi/mujawwad/${num}.mp3`,
      "10": `${QURANICAUDIO_BASE_URL}/qdc/saad_al_ghamdi/murattal/${num}.mp3`,
    };

    const initialUrl = reciterCdnMap[reciterId] || `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${num}.mp3`;
    
    // Immediately start playback in user click gesture context
    playList([initialUrl], 0, `surah_${num}`, surahName);
    currentTimeRef.current = startSeekTime;

    // Fetch API asynchronously in background to sync custom URLs if needed
    try {
      const res = await fetch(`${QURAN_API_BASE_URL}/chapter_recitations/${reciterId}/${num}`);
      if (res.ok) {
        const data = await res.json();
        const apiAudioUrl = data.audio_file?.audio_url;
        if (apiAudioUrl && apiAudioUrl !== initialUrl) {
          const targetSeek = currentTimeRef.current > 0 ? currentTimeRef.current : startSeekTime;
          if (typeof window !== "undefined") {
            window.pendingQuranAudioSeekTime = targetSeek;
          }
          setSrc(apiAudioUrl);
        }
      }
    } catch (e) {
      console.error("Failed to fetch recitation from API:", e);
    }
  };

  const close = () => {
    setOpen(false);
    setPaused(false);
    setSrc("");
    setPlaylist([]);
    setCurrentIndex(-1);
    setTitle("");
    setCurrentTime(0);
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
    close,
    pause,
    resume,
    currentIndex,
    playlistId,
    reciterName,
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
          currentIndex={currentIndex}
          pauseTick={pauseTick}
          playTick={playTick}
          reciterName={reciterName}
        />
      ) : null}
    </AudioContext.Provider>
  );
}
