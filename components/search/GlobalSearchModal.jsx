"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  BookOpen,
  Layers,
  Clock,
  Calendar,
  GraduationCap,
  Play,
  Settings,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  Compass,
  Flame,
  History,
} from "lucide-react";
import { ALL_SURAHS } from "@/lib/surahMetadata";
import { juzList } from "@/lib/juzData";

const APP_NAVIGATION_ITEMS = [
  { name: "Prayer Times & Daily Tracker", href: "/prayer", icon: Clock, category: "App Tools" },
  { name: "Islamic Hijri Calendar", href: "/prayer/calendar", icon: Calendar, category: "App Tools" },
  { name: "Audio Recitations Player", href: "/player", icon: Play, category: "App Tools" },
  { name: "Learn Tajweed & Arabic", href: "/learn", icon: GraduationCap, category: "App Tools" },
  { name: "Browse All Surahs", href: "/surah", icon: BookOpen, category: "Quran Navigation" },
  { name: "Browse Juz / Paras", href: "/juz", icon: Layers, category: "Quran Navigation" },
];

const POPULAR_SURAHS = [
  { number: 1, name: "Al-Fatihah", desc: "The Opening" },
  { number: 2, name: "Al-Baqarah", desc: "The Cow" },
  { number: 18, name: "Al-Kahf", desc: "The Cave" },
  { number: 36, name: "Ya-Sin", desc: "Heart of Quran" },
  { number: 55, name: "Ar-Rahman", desc: "The Beneficent" },
  { number: 67, name: "Al-Mulk", desc: "The Sovereignty" },
];

export default function GlobalSearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("quran_recent_searches");
        if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Error reading recent searches:", e);
      }
    }
  }, [isOpen]);

  const saveRecentSearch = (item) => {
    if (typeof window === "undefined" || !item) return;
    try {
      const current = recentSearches.filter(
        (r) => r.href !== item.href && r.title !== item.title
      );
      const updated = [item, ...current].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("quran_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving recent search:", e);
    }
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global keyboard shortcuts (⌘K / Ctrl+K and Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent("quran-open-global-search"));
        }
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Parse Direct Verse Coordinate e.g. "2:255", "36:1", "1:7"
  const directVerseMatch = useMemo(() => {
    const trimmed = query.trim();
    const match = trimmed.match(/^(\d{1,3}):(\d{1,3})$/);
    if (match) {
      const sNum = parseInt(match[1], 10);
      const aNum = parseInt(match[2], 10);
      if (sNum >= 1 && sNum <= 114) {
        const surahObj = ALL_SURAHS.find((s) => s.number === sNum);
        if (surahObj && aNum >= 1 && aNum <= surahObj.versesCount) {
          return {
            type: "verse_jump",
            title: `Jump to Surah ${surahObj.englishName} (${sNum}), Verse ${aNum}`,
            subtitle: `Direct Ayah Navigation · ${surahObj.arabicName}`,
            href: `/surah/${sNum}?ayah=${aNum}`,
            badge: `${sNum}:${aNum}`,
          };
        }
      }
    }
    return null;
  }, [query]);

  // Filter Surahs, Juz, and Tools
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // 1. Direct Verse Jump if matched
    if (directVerseMatch) {
      results.push(directVerseMatch);
    }

    // 2. Surah Matches
    const matchingSurahs = ALL_SURAHS.filter((s) => {
      const en = s.englishName.toLowerCase();
      const tr = s.translatedName.toLowerCase();
      const ar = s.arabicName.toLowerCase();
      const numStr = String(s.number);
      return en.includes(q) || tr.includes(q) || ar.includes(q) || numStr === q;
    }).map((s) => ({
      type: "surah",
      title: `Surah ${s.englishName}`,
      subtitle: `${s.translatedName} · ${s.versesCount} Ayahs · ${s.revelationPlace}`,
      arabic: s.arabicName,
      href: `/surah/${s.number}`,
      badge: `${s.number}`,
    }));

    results.push(...matchingSurahs);

    // 3. Juz Matches
    const matchingJuz = juzList
      .filter((j) => {
        const en = j.nameEnglish.toLowerCase();
        const ar = j.nameArabic.toLowerCase();
        const numStr = String(j.number);
        const qJuz = q.replace("juz", "").replace("para", "").trim();
        return (
          en.includes(q) ||
          ar.includes(q) ||
          (qJuz && numStr === qJuz) ||
          `juz ${j.number}`.includes(q) ||
          `para ${j.number}`.includes(q)
        );
      })
      .map((j) => ({
        type: "juz",
        title: `Juz ${j.number} (${j.nameEnglish})`,
        subtitle: `${j.start} → ${j.end}`,
        arabic: j.nameArabic,
        href: `/juz/${j.number}`,
        badge: `Juz ${j.number}`,
      }));

    results.push(...matchingJuz);

    // 4. App Navigation Tools
    const matchingTools = APP_NAVIGATION_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(q)
    ).map((item) => ({
      type: "tool",
      title: item.name,
      subtitle: item.category,
      href: item.href,
      icon: item.icon,
    }));

    results.push(...matchingTools);

    return results;
  }, [query, directVerseMatch]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal (Up / Down / Enter)
  const handleInputKeyDown = (e) => {
    if (!searchResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? searchResults.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = searchResults[selectedIndex];
      if (selected) {
        handleNavigate(selected);
      }
    }
  };

  const handleNavigate = (item) => {
    saveRecentSearch({
      title: item.title,
      subtitle: item.subtitle,
      href: item.href,
      type: item.type,
      badge: item.badge,
    });
    onClose();
    router.push(item.href);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200000] flex justify-center items-start pt-14 sm:pt-20 px-3 sm:px-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Search Palette Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] transition-all">
        
        {/* Search Input Header */}
        <div className="relative flex items-center border-b border-gray-200/80 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-950/70 px-4 py-3 sm:py-3.5">
          <Search size={20} className="text-emerald-500 shrink-0 ml-1 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search Surahs, Juz, verses (e.g. 2:255, Ya-Sin, Kahf)..."
            className="w-full bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 placeholder-gray-400 text-sm sm:text-base font-semibold"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mr-1 cursor-pointer"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-slate-800 shrink-0">
            <kbd className="px-2 py-0.5 text-[10px] font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-gray-500 dark:text-gray-400 shadow-2xs">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results / Suggestions Body */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2 sm:p-3 hover-scrollbar flex-1 max-h-[60vh] flex flex-col gap-1"
        >
          {query.trim() ? (
            searchResults.length > 0 ? (
              searchResults.map((item, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={`${item.href}_${idx}`}
                    onClick={() => handleNavigate(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-slate-900 dark:text-slate-100"
                        : "hover:bg-gray-100/70 dark:hover:bg-slate-800/60 border border-transparent text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Left Badge / Icon */}
                      {item.type === "verse_jump" ? (
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs shrink-0 border border-amber-500/30 shadow-xs">
                          <Sparkles size={18} />
                        </div>
                      ) : item.type === "surah" ? (
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 border border-emerald-500/20 shadow-xs">
                          {item.badge}
                        </div>
                      ) : item.type === "juz" ? (
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-xs shrink-0 border border-teal-500/20 shadow-xs">
                          <Layers size={17} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black text-xs shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                          {item.icon ? <item.icon size={17} /> : <Compass size={17} />}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-extrabold truncate flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.type === "verse_jump" && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                              Direct Jump
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Right Arabic Calligraphy or Arrow */}
                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      {item.arabic && (
                        <span className="font-arabic text-lg sm:text-xl text-emerald-600/70 dark:text-emerald-400/70 font-semibold select-none">
                          {item.arabic}
                        </span>
                      )}
                      <ArrowRight
                        size={15}
                        className={`transition-transform duration-200 text-gray-400 ${
                          isSelected ? "translate-x-1 text-emerald-500" : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                <Search size={32} className="opacity-30 mb-1" />
                <p className="text-sm font-bold">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-gray-400">
                  Try searching by Surah name, chapter number, or verse format (e.g. 2:255).
                </p>
              </div>
            )
          ) : (
            /* ── Default Suggestions & Recent History ── */
            <div className="flex flex-col gap-4 p-2">
              {/* Popular Quick Surahs */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-1">
                  <Flame size={14} className="text-amber-500" />
                  <span>Popular Surahs</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_SURAHS.map((s) => (
                    <button
                      key={s.number}
                      onClick={() =>
                        handleNavigate({
                          title: `Surah ${s.name}`,
                          href: `/surah/${s.number}`,
                          type: "surah",
                          badge: `${s.number}`,
                        })
                      }
                      className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-gray-200/50 dark:border-slate-800 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          {s.number}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-850 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick App Tools */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-1">
                  <Compass size={14} className="text-emerald-500" />
                  <span>Explore & Tools</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {APP_NAVIGATION_ITEMS.slice(0, 4).map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          handleNavigate({
                            title: tool.name,
                            href: tool.href,
                            type: "tool",
                          })
                        }
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-gray-200/50 dark:border-slate-800 text-left transition-all group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {tool.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <History size={14} className="text-teal-500" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem("quran_recent_searches");
                      }}
                      className="text-[10px] text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigate(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200/50 dark:border-slate-700 transition-all cursor-pointer"
                      >
                        <span>{r.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 bg-gray-50/80 dark:bg-slate-950/80 border-t border-gray-200/80 dark:border-slate-800/80 text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between font-bold">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] shadow-2xs">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] shadow-2xs">
                ↓
              </kbd>
              <span className="hidden sm:inline">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] shadow-2xs flex items-center">
                <CornerDownLeft size={11} />
              </kbd>
              <span className="hidden sm:inline">Select</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
            Tip: Type 2:255 to jump to Ayatul Kursi
          </span>
        </div>

      </div>
    </div>,
    document.body
  );
}
