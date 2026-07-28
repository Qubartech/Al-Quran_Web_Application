"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

export default function SearchSurahModal({ isOpen, onClose, data }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data || [];
    return (data || []).filter((s) => {
      const en = (s.englishName || "").toLowerCase();
      const tr = (s.englishNameTranslation || "").toLowerCase();
      const ar = (s.name || "").toLowerCase();
      return (
        en.includes(q) ||
        tr.includes(q) ||
        ar.includes(q) ||
        String(s.number).includes(q)
      );
    });
  }, [data, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-start pt-20 px-4 animate-fadeIn">
      {/* Backdrop Click Close */}
      <div className="fixed inset-0 z-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-950 border border-gray-200/20 dark:border-slate-800/80 rounded-2xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden">
        
        {/* Search Header */}
        <div className="relative flex items-center border-b border-gray-200 dark:border-slate-900 bg-gray-50/50 dark:bg-slate-900/50">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah by name, translation, or number..."
            className="w-full pl-11 pr-12 py-4 bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder-gray-400 text-sm font-semibold"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="absolute right-12 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-450 hover:text-slate-700 transition-colors"
            >
              <X size={14} />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="absolute right-4 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-450 hover:text-slate-700 transition-colors"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Results List */}
        <div className="overflow-y-auto max-h-[50vh] p-2 hover-scrollbar flex flex-col divide-y divide-gray-100 dark:divide-slate-900/40">
          {filtered.map((surah, idx) => (
            <Link
              href={`/surah/${surah.number}`}
              key={`${surah.number}-${idx}`}
              onClick={onClose}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-transparent rounded-xl hover:bg-primaryColor/5 dark:hover:bg-emerald-500/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Badge representing surah number */}
                <div className="h-9 w-9 bg-gray-100 dark:bg-slate-900/60 group-hover:bg-primaryColor/10 text-slate-700 dark:text-slate-300 group-hover:text-primaryColor font-extrabold flex items-center justify-center rounded-xl transition-all text-xs shrink-0 border border-gray-200/30 dark:border-slate-800/30">
                  {surah.number}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-100 group-hover:text-primaryColor transition-colors">
                    Surah {surah.englishName}
                  </h4>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    {surah.englishNameTranslation}
                  </p>
                </div>
              </div>
              <div className="text-end flex items-center gap-4">
                <div>
                  <span className="font-arabic text-lg text-slate-700 dark:text-slate-300 group-hover:text-primaryColor transition-colors">
                    {surah.name}
                  </span>
                  <p className="text-[9px] font-bold text-primaryColor dark:text-primaryColor-light mt-0.5">
                    {surah.numberOfAyahs} Ayahs
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-gray-500 dark:text-gray-400 font-semibold">
              No matches found for &quot;{query}&quot;
            </div>
          )}
        </div>
        
        {/* Footer shortcuts helper */}
        <div className="px-6 py-3.5 bg-gray-50 dark:bg-slate-900/40 border-t border-gray-200/50 dark:border-slate-900/50 text-[10px] text-gray-400 dark:text-gray-500 flex justify-between font-bold">
          <span>Tip: Click on a Surah to read it</span>
          <span>Press ESC to exit</span>
        </div>

      </div>
    </div>
  );
}
