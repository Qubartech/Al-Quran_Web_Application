"use client";

import { createContext, useContext, useEffect, useState } from "react";
import SurahAudioPlayer from "@/components/SurahAudioPlayer";

const AudioContext = createContext(null);

export function useAudio() {
  return useContext(AudioContext);
}

export default function AudioProvider({ children }) {
  const [src, setSrc] = useState("");
  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // Restore last audio on reload
    const last = typeof window !== "undefined" ? localStorage.getItem("__audio_src__") : null;
    // Keep player hidden until user explicitly plays audio
    if (last) {
      setSrc(last);
      setOpen(false);
    }
  }, []);

  const play = (newSrc) => {
    setSrc(newSrc);
    setOpen(true);
    setPlaylist([]);
    setCurrentIndex(-1);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_src__", newSrc || "");
      } catch (e) {}
    }
  };

  const playList = (list, startIdx = 0, listId = null) => {
    if (!Array.isArray(list) || list.length === 0) return;
    setPlaylist(list);
    setPlaylistId(listId);
    const idx = Math.max(0, Math.min(startIdx, list.length - 1));
    setCurrentIndex(idx);
    const nextSrc = list[idx];
    setSrc(nextSrc);
    setOpen(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_src__", nextSrc || "");
      } catch (e) {}
    }
  };

  const close = () => {
    setOpen(false);
    setSrc("");
    setPlaylist([]);
    setCurrentIndex(-1);
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
    // Otherwise, stop
    close();
  };

  const value = { src, open, play, playList, close, currentIndex, playlistId };

  return (
    <AudioContext.Provider value={value}>
      {children}
      {open && src ? (
        <SurahAudioPlayer src={src} playAdjacentAudio={onEnded} onClose={close} />
      ) : null}
    </AudioContext.Provider>
  );
}
