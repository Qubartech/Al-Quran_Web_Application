"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";

const TAFSIR_EDITIONS = [
  { slug: "tazkirul-quran-en", name: "Tazkirul Quran", lang: "English" },
  { slug: "en-tafisr-ibn-kathir", name: "Ibn Kathir (Abridged)", lang: "English" },
  { slug: "en-tafsir-maarif-ul-quran", name: "Ma'arif Al-Qur'an", lang: "English" },
  { slug: "bn-tafsir-ahsanul-bayaan", name: "Ahsanul Bayaan", lang: "Bengali" },
  { slug: "bn-tafsir-abu-bakr-zakaria", name: "Abu Bakr Zakaria", lang: "Bengali" },
  { slug: "ar-tafsir-muyassar", name: "Tafsir Muyassar", lang: "Arabic" },
];

export default function TafsirModal({ isOpen, onClose, surahId, ayahNumber, verseKey, arabicText, translationText }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tafsirContent, setTafsirContent] = useState(null);
  const [activeSlug, setActiveSlug] = useState("tazkirul-quran-en");
  const [currentAyah, setCurrentAyah] = useState(ayahNumber || 1);
  const [currentSurah, setCurrentSurah] = useState(surahId || 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (surahId) setCurrentSurah(surahId);
    if (ayahNumber) setCurrentAyah(ayahNumber);
  }, [surahId, ayahNumber]);

  useEffect(() => {
    if (!isOpen || !currentSurah || !currentAyah) return;

    const fetchTafsir = async () => {
      setLoading(true);
      try {
        const url = `${QURAN_API_BASE_URL}/tafsirs/${activeSlug}/by_ayah/${currentSurah}:${currentAyah}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const tafsirObj = json?.tafsir;
          setTafsirContent(tafsirObj?.text || null);
        } else {
          setTafsirContent(null);
        }
      } catch (err) {
        console.error("Tafsir fetch error:", err);
        setTafsirContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTafsir();
  }, [isOpen, currentSurah, currentAyah, activeSlug]);

  if (!isOpen || !mounted) return null;

  const handlePrevAyah = () => {
    if (currentAyah > 1) setCurrentAyah(currentAyah - 1);
  };

  const handleNextAyah = () => {
    setCurrentAyah(currentAyah + 1);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative z-50">
        
        {/* Header Bar (Quran.com Style) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/20 dark:border-slate-800/80 bg-gray-50/60 dark:bg-slate-900/60">
          
          {/* Left Navigation: Surah Badge & Ayah Jump */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-400">
              <BookOpen size={14} />
              <span>Surah {currentSurah}:{currentAyah}</span>
            </div>

            {/* Prev / Next Ayah Arrows */}
            <div className="flex items-center gap-1 bg-gray-200/60 dark:bg-slate-800/60 p-1 rounded-xl">
              <button
                onClick={handlePrevAyah}
                disabled={currentAyah <= 1}
                className="p-1 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Previous Ayah"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextAyah}
                className="p-1 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Next Ayah"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Ayah Text & Translation Preview Banner */}
        <div className="px-6 py-5 bg-emerald-500/5 dark:bg-emerald-500/10 border-b border-emerald-500/15 flex flex-col gap-3">
          {arabicText && (
            <p className="font-arabic text-xl md:text-2xl text-emerald-600 dark:text-emerald-400 text-right leading-relaxed font-semibold" dir="rtl">
              {arabicText}
            </p>
          )}
          {translationText && (
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
              &quot;{translationText}&quot;
            </p>
          )}
        </div>

        {/* Tafsir Edition Selector Pills Bar (Quran.com Style) */}
        <div className="px-6 py-3.5 bg-gray-100/50 dark:bg-slate-800/40 border-b border-gray-200/20 dark:border-slate-800/60 flex items-center gap-2.5 overflow-x-auto hover-scrollbar text-xs font-bold">
          <span className="text-gray-400 text-[11px] uppercase tracking-wider shrink-0 mr-1 font-semibold">Tafsir:</span>
          {TAFSIR_EDITIONS.map((item) => (
            <button
              key={item.slug}
              onClick={() => setActiveSlug(item.slug)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeSlug === item.slug
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-black"
                  : "bg-white/60 dark:bg-slate-900/60 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/30 dark:border-slate-700/50"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Tafsir Notice Box */}
        <div className="px-6 py-3 bg-emerald-500/10 dark:bg-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2 border-b border-emerald-500/10">
          <span>💡 You are reading commentary for verse {currentSurah}:{currentAyah}</span>
        </div>

        {/* Tafsir Real-time HTML Body */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 hover-scrollbar text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500">Fetching Tafsir from Quran.com API...</span>
            </div>
          ) : tafsirContent ? (
            <div
              className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4 [&>p]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3 [&>h2]:mt-8 [&>h2]:mb-4 font-sans"
              dangerouslySetInnerHTML={{ __html: tafsirContent }}
            />
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm font-medium">
              No Tafsir commentary available for this verse in the selected edition.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200/20 dark:border-slate-800/80 flex items-center justify-end bg-gray-50/60 dark:bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
