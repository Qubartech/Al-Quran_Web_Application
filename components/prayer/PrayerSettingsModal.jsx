"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Bell,
  Volume2,
  VolumeX,
  Check,
  Loader2,
  HelpCircle,
  Compass
} from "lucide-react";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";

const CALCULATION_METHODS = [
  { id: 3, name: "Muslim World League (MWL)" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 1, name: "Univ. of Islamic Sciences, Karachi" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 15, name: "Moonsighting Committee Worldwide" },
  { id: 11, name: "MUIS, Singapore" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" }
];

export default function PrayerSettingsModal({
  isOpen,
  onClose,
  activeLocation,
  isManual,
  method,
  school,
  onSearch,
  onResetGps,
  onSaveConfig,
  loading
}) {
  const tracker = usePrayerTracker();
  const [searchQuery, setSearchQuery] = useState("");
  const [testSoundPlaying, setTestSoundPlaying] = useState(false);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
    setSearchQuery("");
  };

  const handleTestChime = () => {
    setTestSoundPlaying(true);
    if (tracker?.playNotificationSound) {
      tracker.playNotificationSound();
    } else {
      // Fallback simple chime
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => setTestSoundPlaying(false), 1200);
  };

  const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-emerald-500/10 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Namaz Settings & Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure calculation methods, location, & reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 md:p-6 overflow-y-auto flex flex-col gap-6 text-sm">

          {/* 1. Location Settings */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-500" /> Location & Coordinates
            </span>

            <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {activeLocation ? `${activeLocation.city}${activeLocation.country ? `, ${activeLocation.country}` : ""}` : "Loading..."}
                </span>
                {activeLocation?.isGps && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    Auto-GPS
                  </span>
                )}
              </div>

              {isManual && (
                <button
                  type="button"
                  onClick={onResetGps}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
                >
                  <RefreshCw size={12} />
                  Reset GPS
                </button>
              )}
            </div>

            {/* City Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city (e.g. London, Makkah)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Search
              </button>
            </form>
          </div>

          {/* 2. Calculation Method & Juristic School */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Compass size={14} className="text-emerald-500" /> Calculation Standard & Fiqh
            </span>

            {/* Calculation Method */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Calculation Method
              </label>
              <select
                value={method}
                onChange={(e) => onSaveConfig(parseInt(e.target.value, 10), school)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Asr Juristic School */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Asr Juristic Method (School)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSaveConfig(method, 0)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    school === 0
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                      : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Standard (Shafi, Maliki, Hanbali)
                </button>
                <button
                  type="button"
                  onClick={() => onSaveConfig(method, 1)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    school === 1
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                      : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Hanafi
                </button>
              </div>
            </div>
          </div>

          {/* 3. Notifications & Alert Sound Controls */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Bell size={14} className="text-emerald-500" /> Notifications & Sound
              </span>

              <button
                type="button"
                onClick={handleTestChime}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
              >
                <Volume2 size={13} className={testSoundPlaying ? "animate-bounce" : ""} />
                Test Sound Chime
              </button>
            </div>

            {/* Global Notifications Switch */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Global Namaz Alerts
                </span>
                <span className="text-[11px] text-slate-400">
                  Receive browser notifications at azan times
                </span>
              </div>
              <button
                type="button"
                onClick={() => tracker?.toggleGlobalReminders()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tracker?.remindersEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tracker?.remindersEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Alert Sound Switch */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                {tracker?.reminderSound ? <Volume2 size={16} className="text-emerald-500" /> : <VolumeX size={16} className="text-slate-400" />}
                Chime Sound Effect
              </div>
              <button
                type="button"
                onClick={() => tracker?.toggleReminderSound()}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  tracker?.reminderSound
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {tracker?.reminderSound ? "ON" : "OFF"}
              </button>
            </div>

            {/* Individual Prayer Reminders */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Individual Prayer Switches
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {corePrayers.map((p) => {
                  const isEnabled = tracker?.prayerReminders?.[p];
                  return (
                    <div
                      key={p}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800"
                    >
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{p}</span>
                      <button
                        type="button"
                        onClick={() => tracker?.togglePrayerReminder(p)}
                        disabled={!tracker?.remindersEnabled}
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg transition-all ${
                          !tracker?.remindersEnabled
                            ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
                            : isEnabled
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {isEnabled ? "Alert On" : "Muted"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
