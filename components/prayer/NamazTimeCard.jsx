"use client";
import React, { useState, useEffect, useRef } from "react";
import { ALADHAN_API_BASE_URL } from "@/lib/api/config";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import Link from "next/link";
import {
  Settings,
  MapPin,
  Search,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Loader2,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  BarChart3,
  Calendar
} from "lucide-react";

// List of calculation methods supported by Aladhan API
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

// Default Fallback: Dhaka, Bangladesh
const defaultLocation = {
  city: "Dhaka",
  country: "Bangladesh",
  latitude: 23.8103,
  longitude: 90.4125,
  isGps: false
};

const NamazTimeCard = ({ gpsLocation }) => {
  const tracker = usePrayerTracker();
  const todayDateStr = new Date().toISOString().split("T")[0];
  const dailyStatus = tracker?.getDailyStatus(todayDateStr);

  // Config States
  const [method, setMethod] = useState(3); // Default to MWL
  const [school, setSchool] = useState(0); // Default to Standard/Shafi
  const [isManual, setIsManual] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);

  // UI & Search States
  const [searchQuery, setSearchQuery] = useState("");
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
    const cleaned = time24.split(" ")[0]; // Strip timezones if any
    const [h, m] = cleaned.split(":");
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    return `${hours.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  // Helper: Calculate countdown and current active prayer
  const calculateCountdown = (timingsData) => {
    if (!timingsData) return null;
    const now = new Date();

    // Core prayers for calculation
    const prayers = [
      { name: "Fajr", timeStr: timingsData.Fajr },
      { name: "Dhuhr", timeStr: timingsData.Dhuhr },
      { name: "Asr", timeStr: timingsData.Asr },
      { name: "Maghrib", timeStr: timingsData.Maghrib },
      { name: "Isha", timeStr: timingsData.Isha }
    ];

    // Convert all to Date objects for today
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
      // After Isha: next is tomorrow's Fajr
      const tomorrowFajr = new Date(firstPrayer.time);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      next = { name: firstPrayer.name, time: tomorrowFajr };
      active = lastPrayer;
    } else if (now < firstPrayer.time) {
      // Before Fajr: next is today's Fajr, active is yesterday's Isha
      next = firstPrayer;
      const yesterdayIsha = new Date(lastPrayer.time);
      yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
      active = { name: lastPrayer.name, time: yesterdayIsha };
    } else {
      // During the day
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

  // 1. Initial configuration load from localStorage
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

  // 2. React to GPS location changes from hook
  useEffect(() => {
    // Only update if user hasn't overridden with manual location
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
        // Geolocation failed or blocked: default to Dhaka
        setActiveLocation(defaultLocation);
      }
    }
  }, [gpsLocation, isManual]);

  // 3. Fetch timings from Aladhan API when coordinates or config change
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
          // Fetch by city/country or general address
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

  // 4. Set up live countdown ticking & background notification checks
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

  // Manual city search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      const response = await fetch(
        `${ALADHAN_API_BASE_URL}/timingsByAddress?address=${encodeURIComponent(searchQuery)}&method=${method}&school=${school}`
      );
      const data = await response.json();

      if (data.code === 200 && data.data) {
        const newLoc = {
          city: searchQuery,
          country: data.data.meta.timezone.split("/")[1] || "",
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
        setSuccessMsg(`Location updated to ${searchQuery}`);
        setSearchQuery("");
        setShowSettings(false);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(`Could not find timings for "${searchQuery}".`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to query this city. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset back to GPS location
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

  // Save specific configurations
  const handleSaveConfig = (newMethod, newSchool) => {
    setMethod(newMethod);
    setSchool(newSchool);
    localStorage.setItem("quran_prayer_method", newMethod);
    localStorage.setItem("quran_prayer_school", newSchool);
    setSuccessMsg("Settings saved!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="glass h-fit w-full p-5 md:p-6 rounded-2xl text-gray-900 dark:text-gray-100 flex flex-col gap-3 md:gap-3.5 relative overflow-hidden transition-all duration-300 border border-white/20 dark:border-slate-800/80 shadow-md">

      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-gray-200/50 dark:border-gray-700/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base md:text-lg font-extrabold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent">
              Namaz Timings
            </h2>
            {activeLocation?.isGps && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                GPS
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Reminder Toggle Button */}
            <button
              onClick={() => tracker?.toggleGlobalReminders()}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${tracker?.remindersEnabled
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              title={tracker?.remindersEnabled ? "Reminders ON" : "Turn ON Reminders"}
            >
              {tracker?.remindersEnabled ? <Bell size={14} className="text-emerald-500 fill-emerald-500/20" /> : <BellOff size={14} />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${showSettings ? 'text-primaryColor' : 'text-gray-500'}`}
              title="Configure settings"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Date & Location Line */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-0.5">
          <div className="flex items-center gap-1.5 truncate max-w-[210px] font-medium">
            <MapPin size={13} className="text-primaryColor shrink-0" />
            <span className="truncate">
              {activeLocation ? activeLocation.city : "Loading..."}
              {activeLocation?.country && `, ${activeLocation.country}`}
            </span>
          </div>
          {hijriDate && <span className="font-semibold text-primaryColor shrink-0 text-xs">{hijriDate}</span>}
        </div>
      </div>

      {/* Compact Today Progress Bar */}
      {dailyStatus && (
        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Today&apos;s Progress
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              {dailyStatus.completedCount}/5 ({dailyStatus.percentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
              style={{ width: `${dailyStatus.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      {showSettings && (
        <div className="p-3.5 rounded-xl bg-gray-50/90 dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
          <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-slate-700/50 pb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Prayer Settings</span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Search City</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. London, UK"
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-1 focus:ring-primaryColor"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primaryColor hover:bg-primaryColor/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                {loading ? <Loader2 size={11} className="animate-spin" /> : <Search size={11} />}
                Search
              </button>
            </div>
          </form>

          {isManual && (
            <button
              onClick={handleResetGps}
              className="text-left text-[11px] text-primaryColor hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw size={11} />
              Reset back to My Location (GPS)
            </button>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Calculation Method</label>
            <select
              value={method}
              onChange={(e) => handleSaveConfig(parseInt(e.target.value, 10), school)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primaryColor text-gray-800 dark:text-gray-200"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Asr Juristic School</label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleSaveConfig(method, 0)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${school === 0
                  ? "bg-primaryColor text-white border-primaryColor"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-655 dark:text-gray-300"
                  }`}
              >
                Standard (Shafi)
              </button>
              <button
                type="button"
                onClick={() => handleSaveConfig(method, 1)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${school === 1
                  ? "bg-primaryColor text-white border-primaryColor"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-655 dark:text-gray-300"
                  }`}
              >
                Hanafi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
          <Check size={13} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !timings && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Loader2 size={24} className="text-primaryColor animate-spin" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Fetching prayer timings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={16} className="shrink-0" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Timings Content */}
      {timings && !loading && (
        <div className="flex flex-col gap-3">

          {/* Sleek Compact Countdown Banner */}
          {prayerStatus && (
            <div className="bg-gradient-to-br from-primaryColor/10 via-emerald-500/5 to-teal-500/10 dark:from-primaryColor/20 dark:to-emerald-500/10 rounded-xl py-2.5 px-3.5 border border-primaryColor/15 dark:border-primaryColor/25 flex items-center justify-between relative overflow-hidden">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light">
                  Next: {prayerStatus.nextPrayer}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Currently: <strong className="text-slate-800 dark:text-slate-200">{prayerStatus.activePrayer}</strong>
                </span>
              </div>
              <div className="text-lg font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {prayerStatus.countdown}
              </div>
            </div>
          )}

          {/* Compact List of Prayer Times */}
          <div className="flex flex-col gap-2.5">
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
                  className={`flex justify-between items-center py-2.5 md:py-3 px-3.5 md:px-4 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-primaryColor/15 border-2 border-primaryColor dark:bg-primaryColor/25 shadow-sm scale-[1.01]"
                    : key === "Sunrise"
                      ? "bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/20"
                      : "bg-white/40 dark:bg-gray-800/40 border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-800/60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2 p-2.5 rounded-md ${isActive
                        ? "bg-primaryColor text-white"
                        : key === "Sunrise"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-gray-200/60 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                        }`}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs md:text-sm font-bold ${isActive
                          ? "text-primaryColor"
                          : key === "Sunrise"
                            ? "text-amber-700 dark:text-amber-300 font-extrabold"
                            : "text-gray-800 dark:text-gray-200"
                          }`}
                      >
                        {item.label}
                      </span>
                      {key === "Sunrise" && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 tracking-wide">
                          Shuruq
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs md:text-sm font-bold font-mono ${isActive
                        ? "text-primaryColor text-sm font-extrabold"
                        : key === "Sunrise"
                          ? "text-amber-600 dark:text-amber-400 font-bold"
                          : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {timeFormatted}
                    </span>

                    {/* Completion Checkmark / Alignment Slot */}
                    {isCheckable ? (
                      <button
                        onClick={() => tracker?.togglePrayerCompletion(todayDateStr, key)}
                        className={`p-0.5 rounded-md transition-all ${isCompleted
                          ? "text-emerald-500 hover:scale-110"
                          : "text-gray-300 hover:text-emerald-400 dark:text-gray-600"
                          }`}
                        title={isCompleted ? `Mark ${key} incomplete` : `Mark ${key} completed`}
                      >
                        {isCompleted ? <CheckCircle2 size={17} className="fill-emerald-500/20" /> : <Circle size={17} />}
                      </button>
                    ) : (
                      <div className="w-[18px] h-[18px] flex items-center justify-center">
                        <Sunrise size={14} className="text-amber-500/50 dark:text-amber-400/50" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Navigation Link */}
          <div className="flex items-center justify-between pt-2.5 border-t border-gray-200/40 dark:border-gray-700/40">
            <Link
              href="/prayer"
              className="text-xs font-bold text-primaryColor hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <BarChart3 size={14} />
              Full Prayer Activity
            </Link>

            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Asr: {school === 1 ? "Hanafi" : "Standard"}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};

export default NamazTimeCard;
