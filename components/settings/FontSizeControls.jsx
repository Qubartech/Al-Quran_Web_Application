"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

export default function FontSizeControls({
  fontSize,
  arabicFontSize,
  onFontSizeChange,
  onArabicFontSizeChange,
}) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Ayah Font Size
      </Typography>
      <Slider
        value={fontSize}
        onChange={onFontSizeChange}
        min={14}
        max={36}
        step={1}
        aria-label="Ayah font size"
        valueLabelDisplay="auto"
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Arabic Ayah Font Size
        </Typography>
        <Slider
          value={arabicFontSize}
          onChange={onArabicFontSizeChange}
          min={18}
          max={48}
          step={1}
          aria-label="Arabic ayah font size"
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
}
