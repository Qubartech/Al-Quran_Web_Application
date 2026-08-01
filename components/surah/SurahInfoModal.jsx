"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, BookOpen, Layers, Info, Sparkles } from "lucide-react";

export default function SurahInfoModal({
  isOpen,
  onClose,
  surahNumber,
  englishName,
  arabicName,
  translatedName,
  revelationPlace,
  versesCount,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const isMakki = (revelationPlace || "").toLowerCase().includes("makkah");

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-900/95 border border-emerald-500/30 text-slate-100 shadow-2xl shadow-emerald-500/10 overflow-hidden flex flex-col my-auto">
        
        {/* Top Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/60 border-b border-slate-800/80 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-lg shadow-sm">
              {surahNumber}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-100">{englishName}</h2>
                <span className="font-arabic text-xl text-emerald-400 font-normal">
                  {arabicName}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                &quot;{translatedName || englishName}&quot;
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors border border-slate-700/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Info Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Revelation Place Card */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <MapPin size={14} className="text-emerald-400" />
                <span>Revelation Place</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold capitalize text-slate-100">
                  {revelationPlace || "Makkah"}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isMakki 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                    : "bg-teal-500/10 text-teal-400 border-teal-500/30"
                }`}>
                  {isMakki ? "Makki" : "Madani"}
                </span>
              </div>
            </div>

            {/* Total Ayahs Card */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <BookOpen size={14} className="text-emerald-400" />
                <span>Total Verses</span>
              </div>
              <span className="text-sm font-extrabold text-slate-100">
                {versesCount || 7} Ayahs
              </span>
            </div>
          </div>

          {/* Surah Position & Meta */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <Layers size={15} className="text-emerald-400" />
              <span>Chapter Position</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Surah {surahNumber} / 114
            </span>
          </div>

          {/* Theme & Overview */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <Sparkles size={14} className="text-emerald-400" />
              <span>About Surah {englishName}</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              Surah {englishName} ({arabicName}) is Chapter {surahNumber} of the Holy Quran, containing {versesCount || 7} verses. Revealed in {revelationPlace || "Makkah"}, it provides deep spiritual guidance and divine principles for humanity.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
