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
  const [paused, setPaused] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [title, setTitle] = useState("");
  const [pauseTick, setPauseTick] = useState(0);
  const [playTick, setPlayTick] = useState(0);

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

  const close = () => {
    setOpen(false);
    setPaused(false);
    setSrc("");
    setPlaylist([]);
    setCurrentIndex(-1);
    setTitle("");
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
    // If at the start, just keep current without closing
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

  const value = { src, open, paused, play, playList, close, pause, resume, currentIndex, playlistId };

  return (
    <AudioContext.Provider value={value}>
      {children}
      {open && src ? (
        <SurahAudioPlayer
          src={src}
          playNext={onEnded}
          playPrev={playPrev}
          onClose={close}
          onPause={() => {
            // Update provider state when player is paused via UI
            pause();
          }}
          onPlay={() => {
            // Update provider state when player is played via UI
            resume();
          }}
          title={title}
          currentIndex={currentIndex}
          pauseTick={pauseTick}
          playTick={playTick}
        />
      ) : null}
    </AudioContext.Provider>
  );
}
