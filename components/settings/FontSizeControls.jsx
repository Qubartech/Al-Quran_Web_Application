"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const sliderStyle = {
  color: "#06BA90",
  height: 6,
  padding: "13px 0",
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#ffffff',
    border: '3px solid #06BA90',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(6, 186, 144, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
    backgroundColor: '#06BA90',
  },
};

export default function FontSizeControls({
  fontSize,
  arabicFontSize,
  onFontSizeChange,
  onArabicFontSizeChange,
}) {
  return (
    <div className="space-y-5 pt-2">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Ayah Font Size
          </label>
          <span className="text-xs font-extrabold text-primaryColor bg-primaryColor/10 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
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

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Arabic Ayah Font Size
          </label>
          <span className="text-xs font-extrabold text-primaryColor bg-primaryColor/10 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
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
