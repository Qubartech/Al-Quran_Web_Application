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
            className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Previous Surah"
          >
            ← Previous
          </Link>
        ) : (
          <button
            disabled
            className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
            aria-disabled="true"
          >
            ← Previous
          </button>
        )}
        {numericId < 114 ? (
          <Link
            href={`/surah/${nextId}`}
            className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Next Surah"
          >
            Next →
          </Link>
        ) : (
          <button
            disabled
            className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
            aria-disabled="true"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
