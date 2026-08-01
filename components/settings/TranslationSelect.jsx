"use client";

import * as React from "react";
import { BookOpen, Search, Check, ChevronDown, CheckSquare, Square } from "lucide-react";

export default function TranslationSelect({
  editions = [],
  value = "", // string or array or comma-separated
  onChange = () => {},
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Parse current selected IDs into an array
  const selectedIds = React.useMemo(() => {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string" && value) return value.split(",").map((s) => s.trim());
    return [];
  }, [value]);

  const renderLabel = React.useCallback((e) => {
    const hasBoth = e.englishName && e.name && e.englishName !== e.name;
    return hasBoth
      ? `${e.englishName} (${e.name})`
      : e.englishName || e.name || e.identifier;
  }, []);

  const filteredEditions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return editions;
    return editions.filter((e) => {
      const label = renderLabel(e).toLowerCase();
      const author = (e.englishName || "").toLowerCase();
      return label.includes(q) || author.includes(q);
    });
  }, [editions, searchQuery, renderLabel]);

  const toggleEdition = (identifier) => {
    let next;
    const strId = String(identifier);
    if (selectedIds.includes(strId)) {
      next = selectedIds.filter((id) => id !== strId);
    } else {
      next = [...selectedIds, strId];
    }
    const resultString = next.join(",");
    onChange({ target: { value: resultString, array: next } });
  };

  const selectedSummary = React.useMemo(() => {
    if (selectedIds.length === 0) return "Select Edition(s)";
    if (selectedIds.length === 1) {
      const match = editions.find((e) => String(e.identifier) === selectedIds[0]);
      return match ? renderLabel(match) : `1 Selected (${selectedIds[0]})`;
    }
    return `${selectedIds.length} Translations Selected`;
  }, [selectedIds, editions, renderLabel]);

  return (
    <div className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Translation Edition(s)
          </label>
        </div>
        {selectedIds.length > 0 && (
          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {selectedIds.length} Active
          </span>
        )}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
      >
        <span className="truncate pr-2">{selectedSummary}</span>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu with Multiple Checkboxes & Search */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 animate-fadeIn max-h-72 flex flex-col">
          {/* Search Input */}
          <div className="relative mb-2 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Edition (e.g. Ibn Kathir, Khattab)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
          </div>

          {/* List of Editions */}
          <div className="flex-1 overflow-y-auto space-y-1 hover-scrollbar pr-1">
            {filteredEditions.length === 0 ? (
              <div className="p-2 text-xs text-slate-400 text-center">No editions found</div>
            ) : (
              filteredEditions.map((e) => {
                const strId = String(e.identifier);
                const isSelected = selectedIds.includes(strId);
                return (
                  <button
                    key={e.identifier}
                    type="button"
                    onClick={() => toggleEdition(e.identifier)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                      isSelected
                        ? "bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "border border-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {isSelected ? (
                        <CheckSquare size={16} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Square size={16} className="text-slate-400 shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                      )}
                      <span className="truncate">{renderLabel(e)}</span>
                    </div>
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
