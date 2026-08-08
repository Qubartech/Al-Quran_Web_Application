"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import useCity from "@/lib/getLocation";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import { ALADHAN_API_BASE_URL } from "@/lib/api/config";
import PrayerSettingsModal from "@/components/prayer/PrayerSettingsModal";
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
  ChevronLeft,
  ChevronRight,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  MapPin,
  SlidersHorizontal,
  Award,
  TrendingUp,
  RotateCcw,
  Check,
  Compass
} from "lucide-react";

const PRAYER_METADATA = {
  Fajr: { 
    icon: Sunrise, 
    label: "Fajr", 
    arabic: "الفجر",
    desc: "Dawn Prayer",
    gradient: "from-indigo-600/20 via-sky-600/10 to-teal-500/10",
    activeGradient: "from-indigo-600 via-sky-600 to-teal-600",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
  },
  Sunrise: { 
    icon: Sun, 
    label: "Sunrise", 
    arabic: "الشروق",
    desc: "Shuruq (No Salah)",
    gradient: "from-amber-500/10 to-orange-500/10",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
  },
  Dhuhr: { 
    icon: Sun, 
    label: "Dhuhr", 
    arabic: "الظهر",
    desc: "Noon Prayer",
    gradient: "from-emerald-600/20 via-teal-600/10 to-cyan-500/10",
    activeGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  },
  Asr: { 
    icon: CloudSun, 
    label: "Asr", 
    arabic: "العصر",
    desc: "Afternoon Prayer",
    gradient: "from-amber-600/20 via-orange-600/10 to-yellow-500/10",
    activeGradient: "from-amber-600 via-orange-600 to-yellow-600",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
  },
  Maghrib: { 
    icon: Sunset, 
    label: "Maghrib", 
    arabic: "المغرب",
    desc: "Sunset Prayer",
    gradient: "from-rose-600/20 via-pink-600/10 to-purple-500/10",
    activeGradient: "from-rose-600 via-pink-600 to-purple-600",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
  },
  Isha: { 
    icon: Moon, 
    label: "Isha", 
    arabic: "العشاء",
    desc: "Night Prayer",
    gradient: "from-blue-600/20 via-indigo-600/10 to-slate-900/10",
    activeGradient: "from-blue-600 via-indigo-600 to-slate-900",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  }
};

const defaultLocation = {
  city: "Dhaka",
  country: "Bangladesh",
  latitude: 23.8103,
  longitude: 90.4125,
  isGps: false
};

export default function PrayerPage() {
  const tracker = usePrayerTracker();
  const gpsLocation = useCity();

  // Selected date for viewing/logging
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [statsWindow, setStatsWindow] = useState(30);

  // Namaz settings state
  const [method, setMethod] = useState(3);
  const [school, setSchool] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timings & Live status
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState("");
  const [prayerStatus, setPrayerStatus] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === todayStr;

  const dailyStatus = tracker?.getDailyStatus(selectedDate);
  const todayDailyStatus = tracker?.getDailyStatus(todayStr);
  const streak = tracker?.getStreakCount() || 0;
  const stats = tracker?.getStats(statsWindow);

  // Streak Badge Title logic
  const streakBadge = useMemo(() => {
    if (streak >= 30) return { title: "Guardian of Salah", color: "from-purple-500 to-indigo-600", text: "text-purple-300" };
    if (streak >= 14) return { title: "Devoted Worshipper", color: "from-emerald-500 to-teal-600", text: "text-emerald-300" };
    if (streak >= 7) return { title: "Flame of Faith", color: "from-amber-500 to-orange-600", text: "text-amber-300" };
    if (streak >= 3) return { title: "Consistent Heart", color: "from-cyan-500 to-blue-600", text: "text-cyan-300" };
    return { title: "Seed of Devotion", color: "from-slate-500 to-slate-700", text: "text-slate-300" };
  }, [streak]);

  // Date manipulation
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

  // Helper 12h time format
  const formatTime12 = (time24) => {
    if (!time24) return "--:--";
    const cleaned = time24.split(" ")[0];
    const [h, m] = cleaned.split(":");
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  // Countdown & Active status calculation
  const calculateCountdown = (timingsData) => {
    if (!timingsData) return null;
    const now = new Date();

    const prayers = [
      { name: "Fajr", timeStr: timingsData.Fajr },
      { name: "Dhuhr", timeStr: timingsData.Dhuhr },
      { name: "Asr", timeStr: timingsData.Asr },
      { name: "Maghrib", timeStr: timingsData.Maghrib },
      { name: "Isha", timeStr: timingsData.Isha }
    ];

    const prayerDates = prayers.map(p => {
      const [h, m] = p.timeStr.split(":");
      const d = new Date(now);
      d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
      return { name: p.name, time: d };
    });

    prayerDates.sort((a, b) => a.time - b.time);

    let next = null;
    let active = null;
    let prevPrayerTime = null;

    const lastPrayer = prayerDates[prayerDates.length - 1];
    const firstPrayer = prayerDates[0];

    if (now > lastPrayer.time) {
      const tomorrowFajr = new Date(firstPrayer.time);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      next = { name: firstPrayer.name, time: tomorrowFajr };
      active = lastPrayer;
      prevPrayerTime = lastPrayer.time;
    } else if (now < firstPrayer.time) {
      next = firstPrayer;
      const yesterdayIsha = new Date(lastPrayer.time);
      yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
      active = { name: lastPrayer.name, time: yesterdayIsha };
      prevPrayerTime = yesterdayIsha;
    } else {
      for (let i = 0; i < prayerDates.length - 1; i++) {
        if (now >= prayerDates[i].time && now < prayerDates[i + 1].time) {
          active = prayerDates[i];
          next = prayerDates[i + 1];
          prevPrayerTime = prayerDates[i].time;
          break;
        }
      }
    }

    const totalIntervalMs = next.time - prevPrayerTime;
    const elapsedMs = now - prevPrayerTime;
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalIntervalMs) * 100)));

    const diffMs = next.time - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    return {
      activePrayer: active.name,
      nextPrayer: next.name,
      nextTime: next.time,
      diffHrs,
      diffMins,
      diffSecs,
      progressPercent
    };
  };

  // 1. Initial config load
  useEffect(() => {
    const savedMethod = localStorage.getItem("quran_prayer_method");
    const savedSchool = localStorage.getItem("quran_prayer_school");
    const savedManual = localStorage.getItem("quran_manual_location");

    if (savedMethod) setMethod(parseInt(savedMethod, 10));
    if (savedSchool) setSchool(parseInt(savedSchool, 10));

    if (savedManual) {
      try {
        const parsed = JSON.parse(savedManual);
        setActiveLocation(parsed);
        setIsManual(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 2. React to GPS location
  useEffect(() => {
    if (isManual) return;

    if (gpsLocation && !gpsLocation.loading) {
      if (!gpsLocation.error && gpsLocation.latitude && gpsLocation.longitude) {
        setActiveLocation({
          city: gpsLocation.city || "Detected Location",
          country: gpsLocation.country || "",
          latitude: gpsLocation.latitude,
          longitude: gpsLocation.longitude,
          isGps: true
        });
      } else {
        setActiveLocation(defaultLocation);
      }
    }
  }, [gpsLocation, isManual]);

  // 3. Fetch timings
  useEffect(() => {
    const fetchTimings = async () => {
      if (!activeLocation) return;
      setLoading(true);

      try {
        let url = "";
        if (activeLocation.isGps) {
          url = `${ALADHAN_API_BASE_URL}/timings?latitude=${activeLocation.latitude}&longitude=${activeLocation.longitude}&method=${method}&school=${school}`;
        } else {
          const query = activeLocation.country
            ? `${activeLocation.city}, ${activeLocation.country}`
            : activeLocation.city;
          url = `${ALADHAN_API_BASE_URL}/timingsByAddress?address=${encodeURIComponent(query)}&method=${method}&school=${school}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200 && data.data) {
          setTimings(data.data.timings);
          const hijri = data.data.date.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimings();
  }, [activeLocation, method, school]);

  // 4. Countdown ticker
  useEffect(() => {
    if (!timings) return;

    const tick = () => {
      const status = calculateCountdown(timings);
      if (status) setPrayerStatus(status);
      if (tracker?.checkTimings) tracker.checkTimings(timings);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timings, tracker]);

  // Config saving handlers
  const handleSearch = async (cityQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ALADHAN_API_BASE_URL}/timingsByAddress?address=${encodeURIComponent(cityQuery)}&method=${method}&school=${school}`
      );
      const data = await response.json();

      if (data.code === 200 && data.data) {
        const newLoc = {
          city: cityQuery,
          country: data.data.meta.timezone?.split("/")[1] || "",
          latitude: data.data.meta.latitude,
          longitude: data.data.meta.longitude,
          isGps: false
        };

        setActiveLocation(newLoc);
        setIsManual(true);
        setTimings(data.data.timings);
        const hijri = data.data.date.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
        localStorage.setItem("quran_manual_location", JSON.stringify(newLoc));
        setShowSettings(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetGps = () => {
    localStorage.removeItem("quran_manual_location");
    setIsManual(false);
    setShowSettings(false);

    if (gpsLocation && !gpsLocation.loading && !gpsLocation.error && gpsLocation.latitude) {
      setActiveLocation({
        city: gpsLocation.city || "Detected Location",
        country: gpsLocation.country || "",
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        isGps: true
      });
    } else {
      setActiveLocation(defaultLocation);
    }
  };

  const handleSaveConfig = (newMethod, newSchool) => {
    setMethod(newMethod);
    setSchool(newSchool);
    localStorage.setItem("quran_prayer_method", newMethod);
    localStorage.setItem("quran_prayer_school", newSchool);
  };

  const corePrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Active theme gradient computation for hero
  const activeHeroGradient = useMemo(() => {
    if (!prayerStatus?.nextPrayer) return "from-emerald-700 via-teal-700 to-cyan-800";
    switch (prayerStatus.nextPrayer) {
      case "Fajr": return "from-indigo-900 via-purple-900 to-slate-900";
      case "Dhuhr": return "from-emerald-700 via-teal-700 to-cyan-800";
      case "Asr": return "from-amber-700 via-orange-800 to-yellow-900";
      case "Maghrib": return "from-rose-800 via-purple-900 to-slate-900";
      case "Isha": return "from-slate-900 via-indigo-950 to-blue-950";
      default: return "from-emerald-700 via-teal-700 to-cyan-800";
    }
  }, [prayerStatus?.nextPrayer]);

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 md:px-6 w-full max-w-screen-2xl mx-auto flex flex-col gap-8">
      
      {/* 1. Dynamic Hero Dashboard Header Card */}
      <div className={`relative overflow-hidden p-6 md:p-10 rounded-3xl bg-gradient-to-br ${activeHeroGradient} text-white shadow-2xl shadow-emerald-500/10 transition-all duration-700`}>
        
        {/* Background Islamic Arch / Decorative Glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>

        {/* Calligraphy & Sub-header */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Column: Title, Hijri Date, Location */}
          <div className="flex flex-col gap-3 max-w-xl">
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-amber-300" /> Daily Salah Companion
              </span>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-md border border-white/15">
                <MapPin size={13} className="text-emerald-300" />
                <span className="truncate max-w-[160px]">
                  {activeLocation ? `${activeLocation.city}${activeLocation.country ? `, ${activeLocation.country}` : ""}` : "Locating..."}
                </span>
                {activeLocation?.isGps && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-200 uppercase">GPS</span>
                )}
              </div>

              {hijriDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold backdrop-blur-md border border-white/15">
                  {hijriDate}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-amber-200/90 text-lg font-arabic font-semibold tracking-wider">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm">
                Prayer Dashboard
              </h1>
            </div>

            <p className="text-sm text-white/80 font-medium leading-relaxed max-w-lg">
              Perform your 5 daily prayers on time, track your habit streak, and receive automatic azan alerts.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Link
                href="/prayer/calendar"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/30 transition-all flex items-center gap-2"
              >
                <Calendar size={14} />
                Full Prayer Calendar
              </Link>

              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md border border-white/25 transition-all flex items-center gap-2 shadow-lg"
              >
                <SlidersHorizontal size={14} />
                Prayer Settings
              </button>

              <button
                onClick={() => tracker?.toggleGlobalReminders()}
                className={`px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md border transition-all flex items-center gap-2 ${
                  tracker?.remindersEnabled
                    ? "bg-emerald-500/40 border-emerald-400/50 text-white shadow-lg"
                    : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                }`}
              >
                {tracker?.remindersEnabled ? (
                  <>
                    <Bell size={14} className="text-amber-300" />
                    Alerts ON
                  </>
                ) : (
                  <>
                    <BellOff size={14} />
                    Turn ON Alerts
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Live Countdown Hero Widget */}
          {prayerStatus && (
            <div className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center gap-4 min-w-[280px] md:min-w-[320px]">
              
              <div className="flex flex-col items-center text-center gap-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-200">
                  Next Prayer
                </span>
                <span className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                  {prayerStatus.nextPrayer}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                    {timings ? formatTime12(timings[prayerStatus.nextPrayer]) : ""}
                  </span>
                </span>
                <span className="text-xs text-white/70">
                  Currently: <strong className="text-white font-bold">{prayerStatus.activePrayer}</strong>
                </span>
              </div>

              {/* Ticking Monospaced Timer */}
              <div className="flex items-center gap-2 bg-black/20 px-6 py-3 rounded-2xl border border-white/15 backdrop-blur-md">
                <Clock size={20} className="text-amber-300 animate-pulse" />
                <span className="text-3xl md:text-4xl font-black font-mono tracking-tight text-white">
                  {prayerStatus.diffHrs.toString().padStart(2, "0")}h{" "}
                  {prayerStatus.diffMins.toString().padStart(2, "0")}m{" "}
                  {prayerStatus.diffSecs.toString().padStart(2, "0")}s
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full flex flex-col gap-1.5">
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${prayerStatus.progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-white/70">
                  <span>{prayerStatus.activePrayer}</span>
                  <span>{prayerStatus.nextPrayer} ({prayerStatus.progressPercent}%)</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Hero Quick Stats Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
          
          {/* 1. Streak */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">Current Streak</span>
              <span className="text-xl font-black text-white">
                {streak} <span className="text-xs font-bold text-amber-300">Days</span>
              </span>
            </div>
          </div>

          {/* 2. Streak Badge */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
              <Award size={22} />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">Rank Level</span>
              <span className={`text-xs font-black truncate ${streakBadge.text}`}>
                {streakBadge.title}
              </span>
            </div>
          </div>

          {/* 3. Today's Logged */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">Today Progress</span>
              <span className="text-xl font-black text-white">
                {todayDailyStatus?.completedCount || 0} / 5
              </span>
            </div>
          </div>

          {/* 4. 30-Day Completion Rate */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <TrendingUp size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">30-Day Score</span>
              <span className="text-xl font-black text-white">
                {stats?.overallPercentage || 0}%
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 Cols): Daily Prayer Cards & Date Selector */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Date Selector & Day Checklist Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-6">
            
            {/* Date Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => changeDateBy(-1)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Calendar size={18} className="text-emerald-500" />
                    {formatDateDisplay(selectedDate)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedDate}</span>
                </div>

                <button
                  onClick={() => changeDateBy(1)}
                  disabled={isToday}
                  className={`p-2 rounded-xl transition-colors ${
                    isToday
                      ? "text-slate-300 dark:text-slate-700 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                  title="Next Day"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {!isToday && (
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  Jump to Today
                </button>
              )}
            </div>

            {/* Daily Completion Progress Bar */}
            {dailyStatus && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Salah Completed for {formatDateDisplay(selectedDate)}
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {dailyStatus.completedCount} of 5 ({dailyStatus.percentage}%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
                    style={{ width: `${dailyStatus.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 5 Daily Salah Interactive Cards */}
            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Daily Prayers Log
              </span>

              {corePrayers.map((prayerName) => {
                const item = PRAYER_METADATA[prayerName];
                const Icon = item.icon;
                const timeRaw = timings ? timings[prayerName] : null;
                const timeFormatted = formatTime12(timeRaw);
                const isActive = isToday && prayerStatus?.activePrayer === prayerName;
                const isCheckable = prayerName !== "Sunrise";
                const isCompleted = dailyStatus?.statusMap[prayerName];
                const isReminderEnabled = tracker?.prayerReminders?.[prayerName];

                return (
                  <div
                    key={prayerName}
                    className={`relative overflow-hidden p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                      isActive
                        ? "bg-gradient-to-r " + item.gradient + " border-2 border-emerald-500 dark:border-emerald-400 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                        : isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/20"
                        : prayerName === "Sunrise"
                        ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20"
                        : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    {/* Left side: Icon, Name, Arabic & Description */}
                    <div className="flex items-center gap-4">
                      
                      <div className={`p-3 rounded-2xl transition-all shadow-sm ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-emerald-600/40 animate-pulse"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : prayerName === "Sunrise"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                        <Icon size={22} />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black ${
                            isActive
                              ? "text-emerald-700 dark:text-emerald-300"
                              : isCompleted
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-900 dark:text-slate-100"
                          }`}>
                            {prayerName}
                          </span>
                          
                          <span className="text-xs font-arabic text-slate-400 font-semibold">
                            {item.arabic}
                          </span>

                          {isActive && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider animate-pulse">
                              NOW ACTIVE
                            </span>
                          )}

                          {prayerName === "Sunrise" && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              Shuruq
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-400 font-medium">
                          {item.desc}
                        </span>
                      </div>

                    </div>

                    {/* Right side: Time & Interactive Checkbox */}
                    <div className="flex items-center gap-4">
                      
                      {/* Time display */}
                      <div className="flex flex-col items-end">
                        <span className={`text-base md:text-lg font-black font-mono ${
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-800 dark:text-slate-200"
                        }`}>
                          {timeFormatted}
                        </span>
                        
                        {isCheckable && (
                          <span className={`text-[11px] font-semibold ${
                            isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                          }`}>
                            {isCompleted ? "Completed" : "Tap to complete"}
                          </span>
                        )}
                      </div>

                      {/* Individual Prayer Switch / Checkbox */}
                      {isCheckable ? (
                        <div className="flex items-center gap-2">
                          
                          {/* Individual Notification Bell Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              tracker?.togglePrayerReminder(prayerName);
                            }}
                            className={`p-2 rounded-xl transition-all ${
                              isReminderEnabled && tracker?.remindersEnabled
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                : "text-slate-300 dark:text-slate-600 hover:text-slate-500"
                            }`}
                            title={isReminderEnabled ? `Mute ${prayerName} alert` : `Enable ${prayerName} alert`}
                          >
                            {isReminderEnabled && tracker?.remindersEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                          </button>

                          {/* Checkmark Button */}
                          <button
                            type="button"
                            onClick={() => tracker?.togglePrayerCompletion(selectedDate, prayerName)}
                            className={`p-2 rounded-2xl transition-all duration-200 ${
                              isCompleted
                                ? "text-emerald-500 bg-emerald-500/20 hover:scale-110 shadow-md shadow-emerald-500/20"
                                : "text-slate-300 dark:text-slate-600 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={28} className="fill-emerald-500/20" />
                            ) : (
                              <Circle size={28} />
                            )}
                          </button>

                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-amber-500/50">
                          <Sunrise size={20} />
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Column (5 Cols): History Bar Chart & Habit Analytics */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 1. Past 7-Day History Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 size={16} className="text-emerald-500" /> Past 7 Days Activity
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Tap day to inspect
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {stats?.dailyHistory?.slice(0, 7).reverse().map((day) => {
                const isCurrentSel = day.date === selectedDate;
                const isDayToday = day.date === todayStr;

                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all ${
                      isCurrentSel
                        ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 shadow-md scale-105"
                        : "border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <span className={`text-[10px] font-extrabold uppercase ${
                      isDayToday ? "text-emerald-600 dark:text-emerald-400 font-black" : "text-slate-400"
                    }`}>
                      {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "narrow" })}
                    </span>

                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {day.completedCount}/5
                    </span>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
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

          {/* 2. Prayer-by-Prayer Breakdown (30 Days) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-emerald-500" /> Prayer Consistency (30 Days)
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => {
                const count = stats?.prayerBreakdown?.[p] || 0;
                const percentage = Math.round((count / (statsWindow || 30)) * 100);

                return (
                  <div key={p} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{p} Salah</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                        {count}/{statsWindow} days ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Notification Chime Preview Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 size={18} className="text-emerald-500" />
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Notification Alert Sound
                </span>
              </div>

              <button
                type="button"
                onClick={() => tracker?.playNotificationSound && tracker.playNotificationSound()}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Volume2 size={13} />
                Test Chime
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Synthesized soft Islamic alert chime plays when prayer time arrives if notification sound is enabled.
            </p>
          </div>

        </div>

      </div>

      {/* Prayer Settings Modal */}
      <PrayerSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        activeLocation={activeLocation}
        isManual={isManual}
        method={method}
        school={school}
        onSearch={handleSearch}
        onResetGps={handleResetGps}
        onSaveConfig={handleSaveConfig}
        loading={loading}
      />

    </div>
  );
}
