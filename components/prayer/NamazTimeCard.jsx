"use client";
import React, { useState, useEffect, useRef } from "react";
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
  SlidersHorizontal
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
          url = `https://api.aladhan.com/v1/timings?latitude=${activeLocation.latitude}&longitude=${activeLocation.longitude}&method=${method}&school=${school}`;
        } else {
          // Fetch by city/country or general address
          const query = activeLocation.country
            ? `${activeLocation.city}, ${activeLocation.country}`
            : activeLocation.city;
          url = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(query)}&method=${method}&school=${school}`;
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

  // 4. Set up live countdown ticking
  useEffect(() => {
    if (!timings) return;

    const tick = () => {
      const status = calculateCountdown(timings);
      if (status) {
        setPrayerStatus(status);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  // Manual city search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(searchQuery)}&method=${method}&school=${school}`
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
        setSuccessMsg(`Switched location to ${searchQuery}`);
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
  const handleResetToGps = () => {
    localStorage.removeItem("quran_manual_location");
    setIsManual(false);
    setSuccessMsg("Resetting to GPS location...");
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
    <div className="glass h-auto w-full p-6 rounded-xl text-gray-900 dark:text-gray-100 flex flex-col gap-4 relative overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent">
            Namaz Timings
          </h2>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${showSettings ? 'text-primaryColor' : 'text-gray-500'}`}
            title="Configure settings"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
        
        {/* Dates */}
        <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{dateStr}</span>
          {hijriDate && <span className="font-semibold text-primaryColor">{hijriDate}</span>}
        </div>

        {/* Location Indicator */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
            <MapPin size={16} className="text-primaryColor animate-bounce" />
            <span className="truncate max-w-[200px]">
              {activeLocation ? activeLocation.city : "Loading location..."}
              {activeLocation?.country && `, ${activeLocation.country}`}
            </span>
          </div>

          {/* GPS / Manual status badge */}
          {activeLocation && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              activeLocation.isGps 
                ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" 
                : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
            }`}>
              {activeLocation.isGps ? "📍 Auto (GPS)" : "✏️ Manual"}
            </span>
          )}
        </div>

        {/* Gps Warning if disabled */}
        {!isManual && gpsLocation?.error && (
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 mt-1 bg-amber-50 dark:bg-amber-950/20 p-1.5 rounded">
            <AlertCircle size={12} />
            <span>GPS access denied. Using default location (Dhaka).</span>
          </div>
        )}
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 py-2 px-3 rounded-lg flex items-center gap-1.5 animate-fadeIn">
          <Check size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200 text-gray-900 dark:text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 pb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Prayer Timings Settings</span>
              <button 
                onClick={() => setShowSettings(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search location manually */}
            <form onSubmit={handleSearch} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Search City</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. London, UK"
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-1 focus:ring-primaryColor"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-primaryColor hover:bg-primaryColor/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                  Search
                </button>
              </div>
            </form>

            {/* Reset to GPS if override active */}
            {isManual && (
              <button 
                onClick={handleResetToGps}
                className="text-left text-xs text-primaryColor hover:underline font-semibold flex items-center gap-1.5 w-fit"
              >
                <RefreshCw size={12} />
                Reset back to My Location (GPS)
              </button>
            )}

            {/* Calc Method Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Calculation Method</label>
              <select
                value={method}
                onChange={(e) => handleSaveConfig(parseInt(e.target.value, 10), school)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primaryColor text-gray-800 dark:text-gray-200"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* School Selector (Asr Standard/Hanafi) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Asr Calculation School</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveConfig(method, 0)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                    school === 0
                      ? "bg-primaryColor text-white border-primaryColor"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-655 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  Standard (Shafi, etc.)
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveConfig(method, 1)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                    school === 1
                      ? "bg-primaryColor text-white border-primaryColor"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-655 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  Hanafi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !timings && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 size={32} className="text-primaryColor animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Fetching prayer timings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                // Re-fetch current location
                setActiveLocation(prev => ({ ...prev }));
              }}
              className="text-xs font-bold border border-rose-300 dark:border-rose-800 px-3 py-1.5 rounded-lg hover:bg-rose-100/50 dark:hover:bg-rose-950/30 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Enter City Manually
            </button>
          </div>
        </div>
      )}

      {/* Timings Content */}
      {timings && !loading && (
        <div className="flex flex-col gap-4">
          
          {/* Countdown Banner */}
          {prayerStatus && (
            <div className="bg-gradient-to-br from-primaryColor/10 to-emerald-500/5 dark:from-primaryColor/20 dark:to-emerald-500/5 rounded-xl p-4 border border-primaryColor/10 dark:border-primaryColor/20 text-center relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-primaryColor/5 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light mb-1">
                Next Prayer: <span className="text-gray-800 dark:text-gray-200">{prayerStatus.nextPrayer}</span>
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
                {prayerStatus.countdown}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                Currently: <span className="font-semibold text-gray-800 dark:text-gray-200">{prayerStatus.activePrayer}</span>
              </div>
            </div>
          )}

          {/* List of Prayer Times */}
          <div className="flex flex-col gap-2.5">
            {Object.keys(PRAYER_METADATA).map((key) => {
              const item = PRAYER_METADATA[key];
              const timeRaw = timings[key];
              const timeFormatted = formatTime12(timeRaw);
              const isActive = prayerStatus?.activePrayer === key;
              const Icon = item.icon;

              return (
                <div
                  key={key}
                  className={`flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primaryColor/10 border-2 border-primaryColor dark:bg-primaryColor/20 shadow-md shadow-primaryColor/5 scale-[1.02]"
                      : "bg-white/40 dark:bg-gray-800/40 border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primaryColor text-white' : 'bg-gray-200/50 dark:bg-gray-800/65 text-gray-500'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isActive ? "text-primaryColor" : "text-gray-800 dark:text-gray-200"}`}>
                        {item.label}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Now Active
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-bold font-mono ${isActive ? "text-primaryColor text-base" : "text-gray-700 dark:text-gray-300"}`}>
                    {timeFormatted}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Calculation Info Footer */}
          <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center border-t border-gray-200/30 dark:border-gray-700/30 pt-3">
            Method: {CALCULATION_METHODS.find(m => m.id === method)?.name || "Custom"} • Asr: {school === 1 ? "Hanafi" : "Standard"}
          </div>

        </div>
      )}

    </div>
  );
};

export default NamazTimeCard;
