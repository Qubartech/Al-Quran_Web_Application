"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import SearchSurahModal from "./SearchSurahModal";

export default function SurahList({ data }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const surahData = data || [];

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="text-xl font-bold">Surah List</div>
        
        {/* Search trigger button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-gray-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 hover:bg-primaryColor/10 text-gray-650 dark:text-slate-300 hover:text-primaryColor dark:hover:text-primaryColor-light transition-all text-xs font-extrabold shadow-sm"
        >
          <Search size={14} />
          Search Surah...
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-10">
        {surahData.map((surah, idx) => (
          <Link href={`/surah/${surah.number}`} key={`${surah.number}-${idx}`}>
            <div className="w-full p-5 rounded-xl flex items-center border border-transparent dark:border-slate-800/80 hover:border-primaryColor dark:hover:border-primaryColor group transition-all duration-305 glass glass-hover">
              
              {/* Surah Number Badge */}
              <div className="h-[48px] w-[48px] bg-primaryColor/10 dark:bg-emerald-500/10 group-hover:text-white group-hover:bg-primaryColor border-2 border-primaryColor/25 group-hover:border-transparent text-primaryColor dark:text-primaryColor-light flex items-center justify-center rounded-lg transition-all duration-355 shrink-0">
                <span className="text-base font-bold">
                  {surah.number}
                </span>
              </div>

              {/* Surah Information */}
              <div className="pl-4 flex justify-between w-full font-semibold">
                <div>
                  <div className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-primaryColor transition-colors">
                    {surah.englishName}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold group-hover:text-primaryColor transition-colors mt-0.5">
                    {surah.englishNameTranslation}
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-arabic text-lg text-gray-800 dark:text-gray-100 group-hover:text-primaryColor transition-colors">
                    {surah.name}
                  </div>
                  <div className="text-[9px] font-bold text-primaryColor dark:text-primaryColor-light mt-0.5">
                    {surah.numberOfAyahs} Ayahs
                  </div>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Search Modal Dialog */}
      <SearchSurahModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        data={surahData}
      />
    </div>
  );
}
