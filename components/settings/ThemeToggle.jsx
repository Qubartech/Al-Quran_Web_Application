"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle({ value, onChange, resolvedTheme }) {
  const isDark = resolvedTheme === "dark";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-emerald-500" />
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Theme Mode
        </label>
      </div>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={onChange}
        sx={{
          position: "relative",
          width: "100%",
          borderRadius: "14px",
          p: "4px",
          bgcolor: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.9)",
          overflow: "hidden",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isDark
            ? "inset 0 1px 2px rgba(255,255,255,0.03)"
            : "inset 0 1px 2px rgba(0,0,0,0.04)",
          boxSizing: "border-box",
          "& .MuiToggleButtonGroup-grouped": {
            margin: 0,
            border: 0,
          },
          "& .MuiToggleButton-root": {
            border: 0,
            px: 1.25,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            transition: "all 200ms ease",
            flex: 1,
            color: isDark ? "#94a3b8" : "#64748b",
            fontWeight: 700,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
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
            borderRadius: "10px",
            transition: "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)",
            transform:
              value === "light"
                ? "translateX(0)"
                : value === "dark"
                ? "translateX(100%)"
                : "translateX(200%)",
            bgcolor: isDark ? "#334155" : "#ffffff",
            boxShadow: isDark
              ? "0 4px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 4px 14px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
            zIndex: 0,
          }}
        />
        <ToggleButton value="light" sx={{ zIndex: 1 }}>
          <Sun size={14} className={value === "light" ? "text-amber-500" : "opacity-70"} />
          <span>Light</span>
        </ToggleButton>
        <ToggleButton value="dark" sx={{ zIndex: 1 }}>
          <Moon size={14} className={value === "dark" ? "text-emerald-400" : "opacity-70"} />
          <span>Dark</span>
        </ToggleButton>
        <ToggleButton value="system" sx={{ zIndex: 1 }}>
          <Monitor size={14} className={value === "system" ? "text-sky-400" : "opacity-70"} />
          <span>System</span>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
