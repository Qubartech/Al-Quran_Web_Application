"use client";

import React, { useState, useEffect } from "react";
import NamazTimeWrapper from "@/components/NamazTimeWrapper";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import { 
  Bell, 
  BellOff, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flame, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon
} from "lucide-react";

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function PrayerPage() {
  const tracker = usePrayerTracker();
  
  // Selected date for viewing/logging (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [statsWindow, setStatsWindow] = useState(30);

  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === todayStr;

  const dailyStatus = tracker?.getDailyStatus(selectedDate);
  const streak = tracker?.getStreakCount() || 0;
  const stats = tracker?.getStats(statsWindow);

  // Date manipulation helpers
  const changeDateBy = (offsetDays) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offsetDays);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const formatDateDisplay = (dateString) => {
    const d = new Date(dateString + "T00:00:00");
    if (dateString === todayStr) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateString === yesterday.toISOString().split("T")[0]) return "Yesterday";

    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div className="min-h-screen pb-16 pt-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/10">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold w-fit backdrop-blur-md border border-white/20">
              <Sparkles size={14} /> Namaz Reminders & Activity Tracker
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Daily Salah Dashboard
            </h1>
            <p className="text-sm text-emerald-100 font-medium leading-relaxed">
              Track your daily 5 prayers, set automatic time reminders with notifications, and build a consistent prayer streak.
            </p>
          </div>

          {/* Quick Streak Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-inner">
            <div className="h-12 w-12 rounded-xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Flame size={28} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Current Streak</span>
              <span className="text-2xl font-black text-white flex items-baseline gap-1">
                {streak} <span className="text-xs font-bold text-amber-200">Days</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Today's Checklist & Activity Logs */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* 1. Date Selector & Daily Checklist Card */}
          <div className="glass p-6 rounded-3xl border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col gap-6">
            
            {/* Date Navigation Header */}
            <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-slate-700/50 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeDateBy(-1)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar size={18} className="text-primaryColor" />
                    {formatDateDisplay(selectedDate)}
                  </span>
                  <span className="text-xs text-gray-400">{selectedDate}</span>
                </div>
                <button
                  onClick={() => changeDateBy(1)}
                  disabled={isToday}
                  className={`p-2 rounded-xl transition-colors ${
                    isToday
                      ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  }`}
                  title="Next Day"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {!isToday && (
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primaryColor/10 text-primaryColor dark:bg-primaryColor/20 hover:bg-primaryColor/20 transition-colors"
                >
                  Jump to Today
                </button>
              )}
            </div>

            {/* Daily Completion Progress Bar */}
            {dailyStatus && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    Salah Completed ({dailyStatus.completedCount} of 5)
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {dailyStatus.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
                    style={{ width: `${dailyStatus.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Prayer Checkmark Items */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Mark Completed Prayers ({formatDateDisplay(selectedDate)})
              </span>

              {corePrayers.map((prayerName) => {
                const Icon = PRAYER_ICONS[prayerName] || Clock;
                const isCompleted = dailyStatus?.statusMap[prayerName];

                return (
                  <div
                    key={prayerName}
                    onClick={() => tracker?.togglePrayerCompletion(selectedDate, prayerName)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-950/20 shadow-sm"
                        : "bg-white/40 dark:bg-slate-800/40 border-gray-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        isCompleted ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-base font-bold ${isCompleted ? "text-emerald-700 dark:text-emerald-300" : "text-slate-800 dark:text-slate-200"}`}>
                          {prayerName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {isCompleted ? "Completed" : "Tap to checkmark"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`p-2 rounded-xl transition-all ${
                        isCompleted
                          ? "text-emerald-500 bg-emerald-500/10 hover:scale-105"
                          : "text-gray-300 dark:text-gray-600 hover:text-emerald-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={26} className="fill-emerald-500/20" /> : <Circle size={26} />}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

          {/* 2. Past 7-Day History Summary Cards */}
          <div className="glass p-6 rounded-3xl border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <BarChart3 size={15} /> Past 7 Days History
            </span>

            <div className="grid grid-cols-7 gap-2">
              {stats?.dailyHistory?.slice(0, 7).reverse().map((day) => {
                const isCurrentSel = day.date === selectedDate;
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all ${
                      isCurrentSel
                        ? "border-primaryColor bg-primaryColor/10 dark:bg-primaryColor/20 shadow-md"
                        : "border-gray-200/50 dark:border-slate-700/50 bg-white/20 dark:bg-slate-800/30 hover:bg-white/40"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-gray-400">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "narrow" })}
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {day.completedCount}/5
                    </span>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${day.percentage}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Reminders & Timings Widget */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* 1. Reminders & Notifications Control Panel */}
          <div className="glass p-6 rounded-3xl border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col gap-5">
            
            <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-slate-700/50 pb-3">
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bell size={18} className="text-emerald-500" />
                Namaz Reminders
              </span>
              
              {/* Master Toggle */}
              <button
                onClick={() => tracker?.toggleGlobalReminders()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tracker?.remindersEnabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tracker?.remindersEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Enable browser notifications to receive an alert when prayer time arrives.
            </p>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-gray-200/40 dark:border-slate-700/40">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                {tracker?.reminderSound ? <Volume2 size={16} className="text-emerald-500" /> : <VolumeX size={16} className="text-gray-400" />}
                Notification Alert Chime
              </div>
              <button
                onClick={() => tracker?.toggleReminderSound()}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  tracker?.reminderSound
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-400"
                }`}
              >
                {tracker?.reminderSound ? "ON" : "OFF"}
              </button>
            </div>

            {/* Individual Prayer Switches */}
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Individual Prayer Alerts
              </span>

              {corePrayers.map((p) => {
                const isEnabled = tracker?.prayerReminders?.[p];
                return (
                  <div
                    key={p}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-gray-200/30 dark:border-slate-700/30"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p} Alert</span>
                    <button
                      onClick={() => tracker?.togglePrayerReminder(p)}
                      disabled={!tracker?.remindersEnabled}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                        !tracker?.remindersEnabled
                          ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                          : isEnabled
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-500"
                      }`}
                    >
                      {isEnabled ? "Enabled" : "Muted"}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

          {/* 2. Namaz Timing Card Integration */}
          <NamazTimeWrapper />

        </div>

      </div>

    </div>
  );
}
