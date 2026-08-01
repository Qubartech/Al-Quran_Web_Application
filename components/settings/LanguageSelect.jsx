"use client";

import * as React from "react";
import { Globe, Search, Check, ChevronDown } from "lucide-react";

export const LANGUAGE_NAMES_MAP = {
  bn: "Bengali (বাংলা)",
  en: "English",
  ur: "Urdu (اردو)",
  ar: "Arabic (العربية)",
  fr: "French (Français)",
  es: "Spanish (Español)",
  ru: "Russian (Русский)",
  tr: "Turkish (Türkçe)",
  id: "Indonesian (Bahasa Indonesia)",
  fa: "Persian (فارسی)",
  de: "German (Deutsch)",
  it: "Italian (Italiano)",
  zh: "Chinese (中文)",
  ja: "Japanese (日本語)",
  ko: "Korean (한국어)",
  hi: "Hindi (हिन्दी)",
  ml: "Malayalam (മലയാളം)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  sw: "Swahili (Kiswahili)",
  ha: "Hausa",
  so: "Somali",
  uz: "Uzbek (Oʻzbekcha)",
  az: "Azerbaijani (Azərbaycan)",
  kk: "Kazakh (Қазақша)",
  tg: "Tajik (Тоҷикӣ)",
  ky: "Kirghiz (Кыргызча)",
  ms: "Malay (Bahasa Melayu)",
  th: "Thai (ไทย)",
  vi: "Vietnamese (Tiếng Việt)",
  nl: "Dutch (Nederlands)",
  pt: "Portuguese (Português)",
  pl: "Polish (Polski)",
  ro: "Romanian (Română)",
  alb: "Albanian (Shqip text)",
  sq: "Albanian (Shqip)",
  bos: "Bosnian (Bosanski)",
  bs: "Bosnian",
  div: "Dhivehi / Maldivian",
  ug: "Uyghur (ئۇيغۇرچە)",
  kurdish: "Kurdish (Kurdî)",
  ku: "Kurdish",
  tagalog: "Tagalog (Filipino)",
  tl: "Tagalog",
  am: "Amharic",
  ber: "Berber",
  che: "Chechen",
};

export default function LanguageSelect({
  languages = [],
  value = "bn",
  onChange = () => {},
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const getLanguageLabel = (code) => {
    if (!code) return "Select Language";
    const lower = String(code).toLowerCase();
    return LANGUAGE_NAMES_MAP[lower] || code.toUpperCase();
  };

  const filteredLanguages = React.useMemo(() => {
    const list = languages.length > 0 ? languages : ["bn", "en", "ur", "ar", "fr", "es", "ru", "tr", "id", "fa"];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((code) => {
      const codeStr = String(code).toLowerCase();
      const label = (LANGUAGE_NAMES_MAP[codeStr] || codeStr).toLowerCase();
      return codeStr.includes(q) || label.includes(q);
    });
  }, [languages, searchQuery]);

  return (
    <div className="space-y-1.5 relative">
      <div className="flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-emerald-500" />
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Translation Language
        </label>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
      >
        <span className="truncate">{getLanguageLabel(value)}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu with Search Bar */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 animate-fadeIn max-h-64 flex flex-col">
          {/* Search Bar Input */}
          <div className="relative mb-2 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Language (e.g. Bangla, English)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
          </div>

          {/* List of Languages */}
          <div className="flex-1 overflow-y-auto space-y-0.5 hover-scrollbar pr-1">
            {filteredLanguages.length === 0 ? (
              <div className="p-2 text-xs text-slate-400 text-center">No languages found</div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = String(value).toLowerCase() === String(lang).toLowerCase();
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      onChange({ target: { value: lang } });
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/10 text-emerald-500 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{getLanguageLabel(lang)}</span>
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