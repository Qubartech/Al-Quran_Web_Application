"use client";

import { Type, Check } from "lucide-react";

export const ARABIC_FONTS = [
  { id: "uthmani", label: "Uthmani Hafs", sample: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", class: "font-arabic-uthmani" },
  { id: "amiri", label: "Amiri Naskh", sample: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", class: "font-arabic-amiri" },
  { id: "lateef", label: "Lateef", sample: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", class: "font-arabic-lateef" },
  { id: "scheherazade", label: "Scheherazade", sample: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", class: "font-arabic-scheherazade" },
  { id: "noto", label: "Noto Naskh", sample: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", class: "font-arabic-noto" },
];

export default function ArabicFontSelect({ value = "uthmani", onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Type size={16} className="text-emerald-500" />
          <span>Arabic Font Style</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {ARABIC_FONTS.find((f) => f.id === value)?.label || "Uthmani"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {ARABIC_FONTS.map((font) => {
          const isSelected = value === font.id;
          return (
            <button
              key={font.id}
              onClick={() => onChange(font.id)}
              className={`w-full p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                isSelected
                  ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/60 shadow-xs"
                  : "bg-slate-100/50 dark:bg-slate-900/40 border-gray-200/50 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex flex-col gap-1 min-w-0 pr-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">
                  {font.label}
                </span>
                <span className={`text-base text-right text-slate-800 dark:text-slate-100 ${font.class}`} dir="rtl">
                  {font.sample}
                </span>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
