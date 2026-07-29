"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Type } from "lucide-react";

const sliderStyle = {
  color: "#10b981",
  height: 6,
  padding: "13px 0",
  '& .MuiSlider-track': {
    border: 'none',
    backgroundColor: '#10b981',
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#ffffff',
    border: '3px solid #10b981',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.25,
    backgroundColor: '#10b981',
  },
};

export default function FontSizeControls({
  fontSize,
  arabicFontSize,
  onFontSizeChange,
  onArabicFontSizeChange,
}) {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center gap-1.5 mb-1">
        <Type className="w-3.5 h-3.5 text-emerald-500" />
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Typography & Font Sizes
        </label>
      </div>

      {/* Live Preview Box */}
      <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-gray-200/80 dark:border-slate-800/80 text-center transition-all overflow-hidden flex flex-col items-center justify-center gap-1.5 shadow-sm">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          Live Sample Preview
        </span>
        <p
          className="font-arabic text-slate-900 dark:text-slate-100 leading-relaxed transition-all select-none my-1"
          style={{ fontSize: `${arabicFontSize}px` }}
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p
          className="text-slate-600 dark:text-slate-400 text-center transition-all select-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          In the name of Allah, the Entirely Merciful.
        </p>
      </div>

      {/* Ayah Font Size Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Translation Font Size
          </label>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            {fontSize}px
          </span>
        </div>
        <Box sx={{ px: 1 }}>
          <Slider
            value={fontSize}
            onChange={onFontSizeChange}
            min={14}
            max={36}
            step={1}
            aria-label="Ayah font size"
            sx={sliderStyle}
          />
        </Box>
      </div>

      {/* Arabic Ayah Font Size Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Arabic Ayah Font Size
          </label>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            {arabicFontSize}px
          </span>
        </div>
        <Box sx={{ px: 1 }}>
          <Slider
            value={arabicFontSize}
            onChange={onArabicFontSizeChange}
            min={18}
            max={48}
            step={1}
            aria-label="Arabic ayah font size"
            sx={sliderStyle}
          />
        </Box>
      </div>
    </div>
  );
}
