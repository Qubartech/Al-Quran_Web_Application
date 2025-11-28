"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ThemeToggle({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 9999,
        p: "5px",
        bgcolor: (t) => (t.palette.mode === "dark" ? "#1f2937" : "#f3f4f6"),
        overflow: "hidden",
        boxShadow: (t) =>
          t.palette.mode === "dark"
            ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.35)"
            : "inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 20px rgba(0,0,0,0.12)",
        boxSizing: "border-box",
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: 0,
        },
        "& .MuiToggleButton-root": {
          border: 0,
          px: 1.25,
          py: 0.75,
          borderRadius: 9999,
          transition: "color 200ms ease",
          flex: 1,
          color: (t) => (t.palette.mode === "dark" ? "#d1d5db" : "#111827"),
          fontWeight: 600,
        },
      }}
    >
      {/* Sliding indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 5,
          bottom: 5,
          left: 5,
          width: `calc((100% - 10px) / 3)`,
          borderRadius: 9999,
          transition: "transform 450ms ease",
          transform:
            value === "light"
              ? "translateX(0)"
              : value === "dark"
              ? "translateX(100%)"
              : "translateX(200%)",
          bgcolor: (t) => (t.palette.mode === "dark" ? "#374151" : "#ffffff"),
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 6px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
          zIndex: 0,
        }}
      />
      <ToggleButton value="light" sx={{ zIndex: 1 }}>
        Light
      </ToggleButton>
      <ToggleButton value="dark" sx={{ zIndex: 1 }}>
        Dark
      </ToggleButton>
      <ToggleButton value="system" sx={{ zIndex: 1 }}>
        System
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
