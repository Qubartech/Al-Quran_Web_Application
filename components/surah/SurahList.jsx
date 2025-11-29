"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function SurahList({ data }) {
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
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="text-xl font-bold">Surah List</div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Surah by name or number..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primaryColor max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-10">
        {filtered.map((surah, idx) => (
          <Link href={`/surah/${surah.number}`} key={`${surah.number}-${idx}`}>
            <div className="w-full p-5 rounded-md flex items-center border border-transparent dark:border-gray-700 hover:border hover:border-primaryColor dark:hover:border-primaryColor group transition-colors glass">
              <div className="h-[50px] w-[60px] bg-gray-200 dark:bg-gray-700 group-hover:text-white group-hover:bg-primaryColor rotate-[45deg] text-black dark:text-gray-100 flex items-center justify-center rounded-md transition-colors">
                <div className="rotate-[-45deg] text-xl font-semibold">
                  {surah.number}
                </div>
              </div>
              <div className="pl-4 flex justify-between w-full font-semibold">
                <div>
                  <div className="text-gray-800 dark:text-gray-100">
                    {surah.englishName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold group-hover:text-primaryColor">
                    {surah.englishNameTranslation}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-gray-800 dark:text-gray-100">
                    {surah.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold group-hover:text-primaryColor">
                    {surah.numberOfAyahs} Ayahs
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-sm text-gray-500 dark:text-gray-400">
            No matches found.
          </div>
        )}
      </div>
    </div>
  );
}
