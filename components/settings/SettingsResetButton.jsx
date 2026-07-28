"use client";
import * as React from "react";

export default function SettingsResetButton({ onReset }) {
  return (
    <div className="w-full flex justify-end pt-2">
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-500 dark:text-rose-400 font-bold text-xs hover:bg-rose-500/10 active:bg-rose-500/20 transition-all duration-300"
      >
        Reset Default Settings
      </button>
    </div>
  );
}
