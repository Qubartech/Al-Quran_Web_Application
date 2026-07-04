"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SurahList from "@/components/surah/SurahList";
import { juzList } from "@/lib/juzData";
import { BookOpen, BookMarked, Search } from "lucide-react";

export default function MainContentTabs({ surahData }) {
  const [activeTab, setActiveTab] = useState("surahs");
  const [juzQuery, setJuzQuery] = useState("");

  const filteredJuz = useMemo(() => {
    const q = juzQuery.trim().toLowerCase();
    if (!q) return juzList;
    return juzList.filter((j) => {
      const en = j.nameEnglish.toLowerCase();
      const ar = j.nameArabic.toLowerCase();
      const num = String(j.number);
      const range = (j.start + " " + j.end).toLowerCase();
      return en.includes(q) || ar.includes(q) || num.includes(q) || range.includes(q);
    });
  }, [juzQuery]);

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200/50 dark:border-slate-800/80 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("surahs")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === "surahs"
              ? "border-primaryColor text-primaryColor font-extrabold"
              : "border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-gray-250"
          }`}
        >
          <BookOpen size={16} />
          Surahs
        </button>
        <button
          onClick={() => setActiveTab("juz")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === "juz"
              ? "border-primaryColor text-primaryColor font-extrabold"
              : "border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-gray-250"
          }`}
        >
          <BookMarked size={16} />
          Juz / Paras
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "surahs" && (
        <SurahList data={surahData} />
      )}

      {activeTab === "juz" && (
        <div className="w-full animate-fadeIn">
          {/* Juz Search */}
          <div className="mb-4 flex justify-between items-center gap-4">
            <div className="text-xl font-bold">Juz List</div>
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                value={juzQuery}
                onChange={(e) => setJuzQuery(e.target.value)}
                placeholder="Search Juz by name, number, or range..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primaryColor text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* Juz Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-10">
            {filteredJuz.map((juz) => (
              <Link href={`/juz/${juz.number}`} key={juz.number}>
                <div className="w-full p-5 rounded-xl flex items-center border border-transparent dark:border-slate-800/80 group transition-all duration-300 glass glass-hover cursor-pointer">
                  {/* Badge */}
                  <div className="h-[48px] w-[48px] shrink-0 bg-primaryColor/10 dark:bg-emerald-500/10 group-hover:text-white group-hover:bg-primaryColor border-2 border-primaryColor/25 group-hover:border-transparent text-primaryColor dark:text-primaryColor-light flex items-center justify-center rounded-lg transition-all duration-355">
                    <span className="text-base font-bold">{juz.number}</span>
                  </div>
                  
                  {/* Info */}
                  <div className="pl-4 flex justify-between items-center w-full">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primaryColor transition-colors text-sm">
                        {juz.nameEnglish}
                      </h3>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 leading-none">
                        {juz.start.split(" ")[0]} — {juz.end.split(" ")[0]}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className="font-arabic text-lg text-slate-700 dark:text-slate-350 group-hover:text-primaryColor transition-colors">
                        {juz.nameArabic}
                      </span>
                      <p className="text-[9px] font-bold text-primaryColor dark:text-primaryColor-light mt-0.5">
                        Juz {juz.number}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredJuz.length === 0 && (
              <div className="col-span-full text-sm text-gray-500 dark:text-gray-400">
                No matches found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
