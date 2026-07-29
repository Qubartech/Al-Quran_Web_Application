"use client";
import * as React from "react";
import { RotateCcw } from "lucide-react";

export default function SettingsResetButton({ onReset }) {
  return (
    <div className="w-full pt-1">
      <button
        onClick={onReset}
        className="w-full py-2.5 px-4 rounded-xl border border-rose-500/20 text-rose-500 dark:text-rose-400 font-bold text-xs hover:bg-rose-500/10 active:bg-rose-500/20 flex items-center justify-center gap-2 transition-all duration-200 group shadow-sm"
      >
        <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform duration-300" />
        <span>Reset Default Settings</span>
      </button>
    </div>
  );
}
