"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import { ALADHAN_API_BASE_URL } from "@/lib/api/config";
import { formatTime12 } from "@/lib/api/aladhanCalendar";
import {
  Calendar as CalendarIcon,
  Moon,
  CheckCircle2,
  ArrowRight,
  UtensilsCrossed,
  Flame,
  Sparkles
} from "lucide-react";

export default function TodayCalendarCard() {
  const tracker = usePrayerTracker();
  const todayStr = new Date().toISOString().split("T")[0];
  const dailyStatus = tracker?.getDailyStatus ? tracker.getDailyStatus(todayStr) : {};
  const streakCount = tracker?.getStreakCount ? tracker.getStreakCount() : 0;

  const [hijriDate, setHijriDate] = useState("");
  const [gregDateStr, setGregDateStr] = useState("");
  const [timings, setTimings] = useState(null);

  useEffect(() => {
    // Format Gregorian date string
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setGregDateStr(now.toLocaleDateString("en-US", options));

    // Fetch Today's Hijri & Prayer Timings
    async function fetchTodayData() {
      try {
        const res = await fetch(`${ALADHAN_API_BASE_URL}/timingsByAddress?address=Makkah,Saudi Arabia&method=4`);
        const json = await res.json();
        if (json.code === 200 && json.data) {
          const h = json.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          setTimings(json.data.timings);
        }
      } catch (err) {
        console.error("Error fetching today's calendar data:", err);
      }
    }

    fetchTodayData();
  }, []);

  const completedCount = dailyStatus?.completedCount || 0;
  const percentage = Math.round((completedCount / 5) * 100);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl glass border border-emerald-100/80 dark:border-slate-800 shadow-xs p-3 sm:p-4 text-slate-900 dark:text-white overflow-hidden backdrop-blur-xl transition-all duration-300">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* 3-Card Proportional Laptop / Desktop & Responsive Mobile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3.5 items-stretch relative z-10">
        
        {/* Card 1: Gregorian & Hijri Date Hero */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100/70 dark:border-slate-800 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-inner">
            <CalendarIcon size={22} className="sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                Today&apos;s Calendar
              </span>
              {hijriDate && (
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                  <Moon size={10} className="text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>{hijriDate}</span>
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800 dark:text-white mt-1 tracking-tight truncate">
              {gregDateStr || "Today"}
            </h3>
          </div>
        </div>

        {/* Card 2: Fasting Timings & Habits Progress */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100/70 dark:border-slate-800 flex flex-col justify-center gap-2.5 shadow-2xs">
          {/* Suhoor & Iftar Timings */}
          {timings && (
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 text-xs border-b border-emerald-100/60 dark:border-slate-800/80 pb-2">
              <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 text-xs whitespace-nowrap">
                <UtensilsCrossed size={13} className="text-teal-600 dark:text-teal-400 shrink-0" /> Fasting Hours
              </span>
              <div className="flex items-center gap-2 font-mono font-extrabold text-[11px] sm:text-xs ml-auto whitespace-nowrap">
                <span className="text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                  <span className="text-slate-400 font-normal text-[10px] sm:text-[11px] mr-1">Suhoor</span>
                  {formatTime12(timings.Fajr)}
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-rose-600 dark:text-rose-300 whitespace-nowrap">
                  <span className="text-slate-400 font-normal text-[10px] sm:text-[11px] mr-1">Iftar</span>
                  {formatTime12(timings.Maghrib)}
                </span>
              </div>
            </div>
          )}

          {/* Habits Progress Bar */}
          <div className="flex items-center justify-between gap-2.5 pt-0.5 min-w-0">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-extrabold gap-2">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">Today&apos;s Habits</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono shrink-0 whitespace-nowrap">
                  {completedCount}/5 ({percentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {streakCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center gap-1 shrink-0 whitespace-nowrap shadow-2xs">
                <Flame size={12} className="text-amber-500 fill-amber-500/30 dark:text-amber-400 shrink-0" />
                <span>{streakCount}d Streak</span>
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Action Card to Open Full Calendar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100/70 dark:border-slate-800 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex flex-col text-center sm:text-left lg:text-center xl:text-left min-w-0">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start lg:justify-center xl:justify-start truncate">
              <Sparkles size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="truncate">Full Prayer Calendar</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
              Monthly timetable, Hijri views & exports
            </span>
          </div>

          <Link
            href="/prayer/calendar"
            className="w-full sm:w-auto xl:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span>Open Calendar</span>
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        </div>

      </div>
    </div>
  );
}
