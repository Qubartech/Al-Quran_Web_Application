"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SurahPrevNextNav() {
  const pathname = usePathname();
  const match = pathname?.match(/^\/surah\/(\d+)(?:\/)?$/);
  if (!match) return null;

  const numericId = parseInt(match[1], 10);
  if (Number.isNaN(numericId)) return null;

  const prevId = numericId - 1;
  const nextId = numericId + 1;

  return (
    <div className="pb-8 flex justify-center">
      <div className="flex items-center gap-3">
        {numericId > 1 ? (
          <Link
            href={`/surah/${prevId}`}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 glass glass-hover hover:border-primaryColor/50 hover:text-primaryColor shadow-sm border border-white/20 dark:border-slate-800/80"
            aria-label="Previous Surah"
          >
            ← Previous
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gray-100/50 text-gray-400 dark:bg-slate-800/50 dark:text-gray-600 cursor-not-allowed border border-gray-200/20 dark:border-slate-800/30"
            aria-disabled="true"
          >
            ← Previous
          </button>
        )}
        {numericId < 114 ? (
          <Link
            href={`/surah/${nextId}`}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 glass glass-hover hover:border-primaryColor/50 hover:text-primaryColor shadow-sm border border-white/20 dark:border-slate-800/80"
            aria-label="Next Surah"
          >
            Next →
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gray-100/50 text-gray-400 dark:bg-slate-800/50 dark:text-gray-600 cursor-not-allowed border border-gray-200/20 dark:border-slate-800/30"
            aria-disabled="true"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
