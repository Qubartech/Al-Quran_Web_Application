"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function LeftBar({ data }) {
  const [query, setQuery] = useState("");

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

  return (
    <div className="py-4 px-4 text-gray-900 dark:text-gray-150 transition-colors bg-transparent flex flex-col h-full">
      {/* Sticky header search title */}
      <div className="bg-transparent border-b border-gray-200/40 dark:border-slate-800/80 pb-3 mb-4 flex flex-col gap-2 shrink-0">
        <h2 className="text-lg font-extrabold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent">
          Surah List
        </h2>
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primaryColor text-xs"
          />
          <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 hover-scrollbar flex-1">
        {filtered.map((surah, idx) => {
          return (
            <Link href={`/surah/${surah?.number}`} key={idx} className="w-full">
              <div className="w-full p-2.5 rounded-xl border border-transparent dark:border-slate-800/10 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 bg-white/20 dark:bg-slate-900/10 hover:bg-white/60 dark:hover:bg-slate-800/30 flex items-center transition-all duration-200 group cursor-pointer">
                {/* Index badge */}
                <div className="h-8 w-8 shrink-0 bg-primaryColor/10 dark:bg-emerald-500/10 border border-primaryColor/25 dark:border-emerald-500/25 group-hover:border-transparent text-primaryColor dark:text-primaryColor-light flex items-center justify-center rounded-lg font-bold text-[11px] transition-all duration-250 group-hover:bg-primaryColor group-hover:text-white">
                  {surah?.number}
                </div>

                {/* Details */}
                <div className="pl-3 flex justify-between items-center w-full min-w-0">
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primaryColor transition-colors">
                      {surah?.englishName}
                    </div>
                    <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-none">
                      {surah?.englishNameTranslation}
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <div className="font-arabic text-sm text-slate-700 dark:text-slate-300 group-hover:text-primaryColor transition-colors leading-none mb-1">
                      {surah?.name}
                    </div>
                    <div className="text-[9px] font-bold text-primaryColor dark:text-primaryColor-light">
                      {surah?.numberOfAyahs} Ayahs
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
            No matches found.
          </div>
        )}
      </div>
    </div>
  );
}
