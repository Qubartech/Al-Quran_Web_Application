"use client";

import * as React from "react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";
import { Headphones, Search, Check, ChevronDown, Loader2 } from "lucide-react";

export const DEFAULT_RECITERS = [
  { id: "7", name: "Mishari Rashid al-`Afasy" },
  { id: "2", name: "AbdulBaset AbdulSamad (Murattal)" },
  { id: "1", name: "AbdulBaset AbdulSamad (Mujawwad)" },
  { id: "3", name: "Abdur-Rahman as-Sudais" },
  { id: "4", name: "Abu Bakr al-Shatri" },
  { id: "5", name: "Hani ar-Rifai" },
  { id: "6", name: "Mahmoud Khalil Al-Husary" },
  { id: "12", name: "Mahmoud Khalil Al-Husary (Muallim)" },
  { id: "9", name: "Mohamed Siddiq al-Minshawi (Murattal)" },
  { id: "8", name: "Mohamed Siddiq al-Minshawi (Mujawwad)" },
  { id: "11", name: "Mohamed al-Tablawi" },
  { id: "10", name: "Sa`ud ash-Shuraym" },
];

export default function ReciterSelect({
  value = "7",
  onChange = () => {},
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [reciters, setReciters] = React.useState(DEFAULT_RECITERS);
  const [loading, setLoading] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${QURAN_API_BASE_URL}/resources/recitations?language=en`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.recitations && data.recitations.length > 0) {
          const mapped = data.recitations.map((r) => {
            const name = r.translated_name?.name || r.reciter_name || "";
            const style = r.style ? ` (${r.style})` : "";
            return {
              id: String(r.id),
              name: `${name}${style}`,
            };
          });
          mapped.sort((a, b) => a.name.localeCompare(b.name));
          setReciters(mapped);
        }
      })
      .catch((err) => console.error("Error fetching reciters list:", err))
      .finally(() => setLoading(false));
  }, []);

  const currentValue = String(value || "7");

  const selectedReciter = React.useMemo(() => {
    const match = reciters.find((r) => String(r.id) === currentValue);
    return match?.name || "Mishari Rashid al-`Afasy";
  }, [reciters, currentValue]);

  const filteredReciters = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reciters;
    return reciters.filter((r) => r.name.toLowerCase().includes(q));
  }, [reciters, searchQuery]);

  return (
    <div ref={dropdownRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-emerald-500" />
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Audio Reciter
          </label>
        </div>
        {loading && <Loader2 size={12} className="animate-spin text-emerald-500" />}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
      >
        <span className="truncate pr-2">{selectedReciter}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu with Search & Reciters List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 animate-fadeIn max-h-64 flex flex-col">
          {/* Search Input */}
          <div className="relative mb-2 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reciter (e.g. Mishary, Sudais)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
          </div>

          {/* List of Reciters */}
          <div className="flex-1 overflow-y-auto space-y-0.5 hover-scrollbar pr-1">
            {filteredReciters.length === 0 ? (
              <div className="p-2 text-xs text-slate-400 text-center">No reciters found</div>
            ) : (
              filteredReciters.map((r) => {
                const isSelected = String(r.id) === currentValue;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onChange(r.id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/10 text-emerald-500 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="truncate pr-2">{r.name}</span>
                    {isSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}


