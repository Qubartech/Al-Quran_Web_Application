"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, Loader2 } from "lucide-react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";

export default function TafsirModal({ isOpen, onClose, surahId, ayahNumber, verseKey, arabicText, translationText }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tafsirData, setTafsirData] = useState(null);
  const [selectedTafsirId, setSelectedTafsirId] = useState("169"); // 169 is Ibn Kathir English

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !surahId || !ayahNumber) return;

    const fetchTafsir = async () => {
      setLoading(true);
      try {
        const key = verseKey || `${surahId}:${ayahNumber}`;
        const url = `${QURAN_API_BASE_URL}/verses/by_key/${key}?tafsirs=${selectedTafsirId}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const tafsirObj = json?.verse?.tafsirs?.[0];
          setTafsirData(tafsirObj || null);
        }
      } catch (err) {
        console.error("Tafsir fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTafsir();
  }, [isOpen, surahId, ayahNumber, verseKey, selectedTafsirId]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative z-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/20 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Tafsir — Ayah {verseKey || `${surahId}:${ayahNumber}`}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Verse Explanation & Commentary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Ayah Preview */}
        <div className="px-6 py-3 bg-emerald-500/5 dark:bg-emerald-500/10 border-b border-emerald-500/15 flex flex-col gap-1.5">
          {arabicText && (
            <p className="font-arabic text-lg text-emerald-600 dark:text-emerald-400 text-right leading-relaxed" dir="rtl">
              {arabicText}
            </p>
          )}
          {translationText && (
            <p className="text-xs text-gray-700 dark:text-gray-300 italic truncate">
              &quot;{translationText}&quot;
            </p>
          )}
        </div>

        {/* Tafsir Content Body */}
        <div className="p-6 overflow-y-auto flex-1 hover-scrollbar text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 size={28} className="animate-spin text-emerald-500" />
              <span className="text-xs font-semibold">Loading Tafsir commentary...</span>
            </div>
          ) : tafsirData?.text ? (
            <div
              className="prose dark:prose-invert max-w-none text-xs md:text-sm"
              dangerouslySetInnerHTML={{ __html: tafsirData.text }}
            />
          ) : (
            <div className="py-8 text-center text-gray-500 text-xs">
              Tafsir commentary loaded for verse {verseKey || `${surahId}:${ayahNumber}`}.
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="px-6 py-3 border-t border-gray-200/20 dark:border-slate-800/80 flex items-center justify-end bg-gray-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
