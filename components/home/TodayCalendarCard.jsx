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
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 shadow-2xl p-3 sm:p-4 text-white overflow-hidden backdrop-blur-xl">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* 3-Card Proportional Laptop / Desktop & Responsive Mobile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch relative z-10">
        
        {/* Card 1: Gregorian & Hijri Date Hero */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-850/60 border border-slate-800/80 flex items-center gap-3.5 shadow-sm">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-inner">
            <CalendarIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Today&apos;s Calendar
              </span>
              {hijriDate && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                  <Moon size={11} className="text-amber-400" />
                  {hijriDate}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1 tracking-tight truncate">
              {gregDateStr || "Today"}
            </h3>
          </div>
        </div>

        {/* Card 2: Fasting Timings & Habits Progress */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-850/60 border border-slate-800/80 flex flex-col justify-center gap-2.5 shadow-sm">
          {/* Suhoor & Iftar Timings */}
          {timings && (
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <UtensilsCrossed size={14} className="text-teal-400" /> Fasting Hours
              </span>
              <div className="flex items-center gap-2.5 font-mono font-extrabold text-xs">
                <span className="text-emerald-300">
                  <span className="text-slate-400 font-normal text-[11px] mr-1">Suhoor</span>
                  {formatTime12(timings.Fajr)}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-rose-300">
                  <span className="text-slate-400 font-normal text-[11px] mr-1">Iftar</span>
                  {formatTime12(timings.Maghrib)}
                </span>
              </div>
            </div>
          )}

          {/* Habits Progress Bar */}
          <div className="flex items-center justify-between gap-2.5 pt-0.5">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold">
                <span className="text-slate-300 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Today&apos;s Habits
                </span>
                <span className="text-emerald-400 font-mono">{completedCount}/5 ({percentage}%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {streakCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center gap-1 shrink-0">
                <Flame size={12} className="text-amber-400 fill-amber-400/30" />
                <span>{streakCount}d Streak</span>
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Action Card to Open Full Calendar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-850/60 to-slate-900 border border-emerald-500/25 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex flex-col text-center sm:text-left lg:text-center xl:text-left">
            <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 justify-center sm:justify-start lg:justify-center xl:justify-start">
              <Sparkles size={14} className="text-amber-400" />
              Full Prayer Calendar
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              Monthly timetable, Hijri views & exports
            </span>
          </div>

          <Link
            href="/prayer/calendar"
            className="w-full sm:w-auto xl:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/50 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span>Open Calendar</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  );
}
