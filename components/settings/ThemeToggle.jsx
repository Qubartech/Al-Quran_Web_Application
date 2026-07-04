"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ThemeToggle({ value, onChange, resolvedTheme }) {
  const isDark = resolvedTheme === "dark";

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: "12px",
        p: "4px",
        bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(241, 245, 249, 0.8)",
        overflow: "hidden",
        border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isDark
          ? "inset 0 1px 1px rgba(255,255,255,0.03)"
          : "inset 0 1px 1px rgba(0,0,0,0.03)",
        boxSizing: "border-box",
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
          border: 0,
        },
        "& .MuiToggleButton-root": {
          border: 0,
          px: 1.25,
          py: 0.75,
          borderRadius: "8px",
          textTransform: "none",
          transition: "all 200ms ease",
          flex: 1,
          color: isDark ? "#94a3b8" : "#64748b",
          fontWeight: 700,
          fontSize: "0.8rem",
          "&.Mui-selected": {
            color: isDark ? "#ffffff" : "#0f172a",
            bgcolor: "transparent !important",
          },
          "&:hover": {
            bgcolor: "transparent",
            color: isDark ? "#f1f5f9" : "#0f172a",
          }
        },
      }}
    >
      {/* Sliding indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 4,
          width: `calc((100% - 8px) / 3)`,
          borderRadius: "8px",
          transition: "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          transform:
            value === "light"
              ? "translateX(0)"
              : value === "dark"
              ? "translateX(100%)"
              : "translateX(200%)",
          bgcolor: isDark ? "#334155" : "#ffffff",
          boxShadow: isDark
            ? "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
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
