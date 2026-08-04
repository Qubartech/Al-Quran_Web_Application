"use client";

import React, { useState, useEffect } from "react";
import { ALADHAN_API_BASE_URL } from "@/lib/api/config";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import Link from "next/link";
import {
  MapPin,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Loader2,
  Check,
  AlertCircle,
  SlidersHorizontal,
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  BarChart3
} from "lucide-react";
import PrayerSettingsModal from "./PrayerSettingsModal";

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

const PRAYER_METADATA = {
  Fajr: { icon: Sunrise, label: "Fajr" },
  Sunrise: { icon: Sun, label: "Sunrise" },
  Dhuhr: { icon: Sun, label: "Dhuhr" },
  Asr: { icon: CloudSun, label: "Asr" },
  Maghrib: { icon: Sunset, label: "Maghrib" },
  Isha: { icon: Moon, label: "Isha" }
};

const defaultLocation = {
  city: "Dhaka",
  country: "Bangladesh",
  latitude: 23.8103,
  longitude: 90.4125,
  isGps: false
};

const NamazTimeCard = ({ gpsLocation, compact = false, showFullLink = true, className = "" }) => {
  const tracker = usePrayerTracker();
  const todayDateStr = new Date().toISOString().split("T")[0];
  const dailyStatus = tracker?.getDailyStatus(todayDateStr);

  // Config States
  const [method, setMethod] = useState(3);
  const [school, setSchool] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);

  // UI & Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Timing Data States
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState("");
  const [prayerStatus, setPrayerStatus] = useState(null);

  // Helper: Format 24h time string to 12h AM/PM
  const formatTime12 = (time24) => {
    if (!time24) return "";
    const cleaned = time24.split(" ")[0];
    const [h, m] = cleaned.split(":");
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  // Helper: Calculate countdown and active prayer
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

    const lastPrayer = prayerDates[prayerDates.length - 1];
    const firstPrayer = prayerDates[0];

    if (now > lastPrayer.time) {
      const tomorrowFajr = new Date(firstPrayer.time);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      next = { name: firstPrayer.name, time: tomorrowFajr };
      active = lastPrayer;
    } else if (now < firstPrayer.time) {
      next = firstPrayer;
      const yesterdayIsha = new Date(lastPrayer.time);
      yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
      active = { name: lastPrayer.name, time: yesterdayIsha };
    } else {
      for (let i = 0; i < prayerDates.length - 1; i++) {
        if (now >= prayerDates[i].time && now < prayerDates[i + 1].time) {
          active = prayerDates[i];
          next = prayerDates[i + 1];
          break;
        }
      }
    }

    const diffMs = next.time - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    const countdownStr = `${diffHrs.toString().padStart(2, "0")}h ${diffMins.toString().padStart(2, "0")}m ${diffSecs.toString().padStart(2, "0")}s`;

    return {
      activePrayer: active.name,
      nextPrayer: next.name,
      countdown: countdownStr
    };
  };

  // Initial config load
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
        console.error("Failed to parse manual location", e);
      }
    }
  }, []);

  // React to GPS location
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

  // Fetch timings
  useEffect(() => {
    const fetchTimings = async () => {
      if (!activeLocation) return;
      setLoading(true);
      setError(null);

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
        } else {
          setError("Failed to fetch timings for this location.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimings();
  }, [activeLocation, method, school]);

  // Live countdown ticker & background notification checker
  useEffect(() => {
    if (!timings) return;

    const tick = () => {
      const status = calculateCountdown(timings);
      if (status) {
        setPrayerStatus(status);
      }
      if (tracker?.checkTimings) {
        tracker.checkTimings(timings);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timings, tracker]);

  // Search handler
  const handleSearch = async (cityQuery) => {
    if (!cityQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg("");

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
        setSuccessMsg(`Location updated to ${cityQuery}`);
        setShowSettings(false);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(`Could not find timings for "${cityQuery}".`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to query this city. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset GPS
  const handleResetGps = () => {
    localStorage.removeItem("quran_manual_location");
    setIsManual(false);
    setSuccessMsg("Resetting to GPS location...");
    setShowSettings(false);
    setTimeout(() => setSuccessMsg(""), 3000);

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

  // Save config
  const handleSaveConfig = (newMethod, newSchool) => {
    setMethod(newMethod);
    setSchool(newSchool);
    localStorage.setItem("quran_prayer_method", newMethod);
    localStorage.setItem("quran_prayer_school", newSchool);
    setSuccessMsg("Settings saved!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div className={`relative w-full rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl p-5 md:p-6 flex flex-col justify-between gap-4 overflow-hidden transition-all duration-300 ${className}`}>
      
      {/* Background Soft Glow Effect */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Namaz Timings
            </h2>
            {activeLocation?.isGps && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                GPS
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => tracker?.toggleGlobalReminders()}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                tracker?.remindersEnabled
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={tracker?.remindersEnabled ? "Reminders ON" : "Turn ON Reminders"}
            >
              {tracker?.remindersEnabled ? <Bell size={15} className="text-emerald-500 fill-emerald-500/20" /> : <BellOff size={15} />}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors"
              title="Configure settings"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Location & Hijri Date */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 truncate max-w-[220px]">
            <MapPin size={14} className="text-emerald-500 shrink-0" />
            <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
              {activeLocation ? activeLocation.city : "Loading..."}
              {activeLocation?.country && `, ${activeLocation.country}`}
            </span>
          </div>
          {hijriDate && <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">{hijriDate}</span>}
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 py-2 px-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !timings && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 flex-1">
          <Loader2 size={28} className="text-emerald-500 animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Fetching prayer timings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Timings Content */}
      {timings && !loading && (
        <div className="flex-1 flex flex-col justify-between gap-3">
          
          {/* Live Countdown Banner */}
          {prayerStatus && (
            <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/15 flex items-center justify-between">
              <div className="flex flex-col gap-0.5 z-10">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                  Next: {prayerStatus.nextPrayer}
                </span>
                <span className="text-xs text-white/90 font-medium">
                  Active: <strong className="text-white font-bold">{prayerStatus.activePrayer}</strong>
                </span>
              </div>
              <div className="text-xl font-black font-mono tracking-tight text-white drop-shadow z-10">
                {prayerStatus.countdown}
              </div>
            </div>
          )}

          {/* Timings List - Flex 1 & Distribute evenly */}
          <div className="flex-1 flex flex-col justify-between gap-2">
            {Object.keys(PRAYER_METADATA).map((key) => {
              const item = PRAYER_METADATA[key];
              const timeRaw = timings[key];
              const timeFormatted = formatTime12(timeRaw);
              const isActive = prayerStatus?.activePrayer === key;
              const Icon = item.icon;
              const isCheckable = key !== "Sunrise";
              const isCompleted = dailyStatus?.statusMap[key];

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/15 border-2 border-emerald-500 dark:bg-emerald-950/40 shadow-md scale-[1.01]"
                      : key === "Sunrise"
                      ? "bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20"
                      : "bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 hover:bg-white dark:hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : key === "Sunrise"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                    }`}>
                      <Icon size={16} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs md:text-sm font-bold ${
                        isActive
                          ? "text-emerald-700 dark:text-emerald-400"
                          : key === "Sunrise"
                          ? "text-amber-700 dark:text-amber-300 font-extrabold"
                          : "text-slate-800 dark:text-slate-200"
                      }`}>
                        {item.label}
                      </span>
                      {key === "Sunrise" && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                          Shuruq
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs md:text-sm font-black font-mono ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : key === "Sunrise"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {timeFormatted}
                    </span>

                    {isCheckable ? (
                      <button
                        onClick={() => tracker?.togglePrayerCompletion(todayDateStr, key)}
                        className={`p-1 rounded-xl transition-all ${
                          isCompleted
                            ? "text-emerald-600 dark:text-emerald-400 hover:scale-110"
                            : "text-slate-300 dark:text-slate-600 hover:text-emerald-500"
                        }`}
                        title={isCompleted ? `Mark ${key} incomplete` : `Mark ${key} completed`}
                      >
                        {isCompleted ? <CheckCircle2 size={18} className="fill-emerald-500/20" /> : <Circle size={18} />}
                      </button>
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Sunrise size={14} className="text-amber-500/40" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Link if enabled */}
          {showFullLink && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/80">
              <Link
                href="/prayer"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 transition-colors"
              >
                <BarChart3 size={14} />
                Full Prayer Activity & Streak
              </Link>
              <span className="text-[10px] font-semibold text-slate-400">
                Method: {CALCULATION_METHODS.find(m => m.id === method)?.name.split(" ")[0]}
              </span>
            </div>
          )}

        </div>
      )}

      {/* Settings Modal */}
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
};

export default NamazTimeCard;
