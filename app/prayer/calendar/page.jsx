"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import useCity from "@/lib/getLocation";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import { fetchMonthlyCalendar } from "@/lib/api/aladhanCalendar";
import { exportCalendarToCSV, exportCalendarToICS, triggerCalendarPrint } from "@/lib/utils/calendarExport";
import PrayerSettingsModal from "@/components/prayer/PrayerSettingsModal";

import PrayerCalendarHeader from "@/components/prayer/calendar/PrayerCalendarHeader";
import PrayerCalendarTable from "@/components/prayer/calendar/PrayerCalendarTable";
import PrayerCalendarGrid from "@/components/prayer/calendar/PrayerCalendarGrid";
import PrayerCalendarYearView from "@/components/prayer/calendar/PrayerCalendarYearView";
import PrayerDayDetailModal from "@/components/prayer/calendar/PrayerDayDetailModal";
import HijriCalendarView from "@/components/prayer/calendar/HijriCalendarView";

import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

const defaultLocation = {
  city: "Dhaka",
  country: "Bangladesh",
  latitude: 23.8103,
  longitude: 90.4125,
  isGps: false
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function PrayerCalendarPage() {
  const gpsLocation = useCity();
  const tracker = usePrayerTracker();

  // Date selection state
  const now = new Date();
  const [year, setYear] = useState(() => now.getFullYear());
  const [month, setMonth] = useState(() => now.getMonth() + 1);

  // Namaz settings state initialized from localStorage synchronously
  const [method, setMethod] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quran_prayer_method");
      if (saved) return parseInt(saved, 10);
    }
    return 3;
  });

  const [school, setSchool] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quran_prayer_school");
      if (saved) return parseInt(saved, 10);
    }
    return 0;
  });

  const [midnightMode, setMidnightMode] = useState(0);
  const [latitudeAdjustmentMethod, setLatitudeAdjustmentMethod] = useState(3);
  const [adjustment, setAdjustment] = useState(0);

  const [isManual, setIsManual] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("quran_manual_location");
    }
    return false;
  });

  const [activeLocation, setActiveLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quran_manual_location");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) { }
      }
    }
    return defaultLocation;
  });

  // View & Modal states
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table' | 'year' | 'hijri'
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDayModal, setSelectedDayModal] = useState(null);

  // Data & Loading states
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // React to GPS location when available (without cyclic loop)
  useEffect(() => {
    if (isManual) return;
    if (gpsLocation && !gpsLocation.loading && !gpsLocation.error && gpsLocation.latitude && gpsLocation.longitude) {
      setActiveLocation({
        city: gpsLocation.city || "Detected Location",
        country: gpsLocation.country || "",
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        isGps: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsLocation?.loading, gpsLocation?.city, gpsLocation?.country, gpsLocation?.latitude, gpsLocation?.longitude, isManual]);

  // Load monthly calendar data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loc = activeLocation || defaultLocation;

    fetchMonthlyCalendar({
      year,
      month,
      city: loc.city,
      country: loc.country,
      latitude: loc.isGps ? loc.latitude : null,
      longitude: loc.isGps ? loc.longitude : null,
      method,
      school,
      midnightMode,
      latitudeAdjustmentMethod
    }).then((res) => {
      if (!isMounted) return;
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCalendarDays(res.data);
        setError(null);
      } else {
        setError(res.error || "Failed to load prayer calendar data.");
      }
    }).catch((err) => {
      if (!isMounted) return;
      setError(err.message || "An unexpected error occurred.");
    }).finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, activeLocation?.city, activeLocation?.country, activeLocation?.latitude, activeLocation?.longitude, method, school, midnightMode, latitudeAdjustmentMethod]);

  // Compute Hijri Month Summary String
  const hijriSummary = useMemo(() => {
    if (!calendarDays || calendarDays.length === 0) return "";
    const firstHijri = calendarDays[0]?.date?.hijri || {};
    const lastHijri = calendarDays[calendarDays.length - 1]?.date?.hijri || {};

    if (firstHijri.month?.en === lastHijri.month?.en) {
      return `${firstHijri.month?.en || ""} ${firstHijri.year} AH`;
    }
    return `${firstHijri.month?.en || ""} – ${lastHijri.month?.en || ""} ${firstHijri.year} AH`;
  }, [calendarDays]);

  // Location Handlers
  const handleSearchLocation = async (queryStr) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(queryStr)}`
      );
      const json = await response.json();

      if (json.code === 200 && Array.isArray(json.data) && json.data.length > 0) {
        const newLoc = {
          city: queryStr,
          country: json.data[0]?.meta?.timezone?.split("/")[1] || "",
          latitude: json.data[0]?.meta?.latitude,
          longitude: json.data[0]?.meta?.longitude,
          isGps: false
        };
        setIsManual(true);
        setActiveLocation(newLoc);
        localStorage.setItem("quran_manual_location", JSON.stringify(newLoc));
      } else {
        alert(`Location "${queryStr}" not found. Please try another city.`);
      }
    } catch (e) {
      console.error(e);
      alert("Error searching location. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetGps = () => {
    localStorage.removeItem("quran_manual_location");
    setIsManual(false);
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
    setShowSettings(false);
  };

  const handleExportCSV = () => {
    exportCalendarToCSV(
      calendarDays,
      activeLocation ? `${activeLocation.city}_${activeLocation.country}` : "Location",
      MONTH_NAMES[month - 1],
      year
    );
  };

  const handleExportICS = () => {
    exportCalendarToICS(
      calendarDays,
      activeLocation ? `${activeLocation.city}_${activeLocation.country}` : "Location",
      MONTH_NAMES[month - 1],
      year
    );
  };

  const locationName = activeLocation
    ? `${activeLocation.city}${activeLocation.country ? `, ${activeLocation.country}` : ""}`
    : "Location";

  return (
    <div className="min-h-screen text-slate-100 transition-colors pb-24 pt-4 px-3 sm:px-6 lg:px-8 from-emerald-950/20 via-slate-950 to-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Printable Header - Visible ONLY during print */}
        <div className="hidden print:block text-center p-6 border-b border-black mb-4">
          <h1 className="text-2xl font-bold">Islamic Prayer Times & Hijri Calendar</h1>
          <p className="text-sm font-semibold">{MONTH_NAMES[month - 1]} {year} ({hijriSummary})</p>
          <p className="text-xs">Location: {locationName}</p>
        </div>

        {/* Header Controls */}
        <PrayerCalendarHeader
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
          activeLocation={activeLocation}
          onSearchLocation={handleSearchLocation}
          onResetGps={handleResetGps}
          hijriSummary={hijriSummary}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenSettings={() => setShowSettings(true)}
          onExportCSV={handleExportCSV}
          onExportICS={handleExportICS}
          onPrint={triggerCalendarPrint}
          loading={loading}
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="w-full py-28 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col items-center justify-center gap-3">
            <Loader2 size={40} className="text-emerald-500 animate-spin" />
            <span className="text-sm font-bold text-slate-300 animate-pulse">
              Calculating AlAdhan monthly prayer timetable...
            </span>
          </div>
        )}

        {/* Error View */}
        {!loading && error && (
          <div className="p-10 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex flex-col items-center gap-4 text-center">
            <AlertTriangle size={36} />
            <div>
              <h3 className="text-lg font-extrabold text-rose-200">Failed to load prayer calendar</h3>
              <p className="text-xs text-rose-300/80 max-w-md mt-1">{error}</p>
            </div>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchMonthlyCalendar({
                  year,
                  month,
                  city: activeLocation?.city || "Dhaka",
                  country: activeLocation?.country || "Bangladesh",
                  method,
                  school
                }).then((res) => {
                  if (res.success) setCalendarDays(res.data);
                  else setError(res.error);
                }).finally(() => setLoading(false));
              }}
              className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all shadow-lg flex items-center gap-2"
            >
              <RefreshCw size={14} /> Retry Fetch
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {!loading && !error && (
          <>
            {viewMode === "table" && (
              <PrayerCalendarTable
                days={calendarDays}
                todayStr={todayStr}
                onSelectDay={(day) => setSelectedDayModal(day)}
                trackerStatusMap={tracker?.prayerLog || {}}
              />
            )}

            {viewMode === "grid" && (
              <PrayerCalendarGrid
                days={calendarDays}
                todayStr={todayStr}
                onSelectDay={(day) => setSelectedDayModal(day)}
                trackerStatusMap={tracker?.prayerLog || {}}
              />
            )}

            {viewMode === "year" && (
              <PrayerCalendarYearView
                year={year}
                currentMonth={month}
                onSelectMonth={(selectedM) => {
                  setMonth(selectedM);
                  setViewMode("table");
                }}
              />
            )}

            {viewMode === "hijri" && (
              <HijriCalendarView
                days={calendarDays.map((d) => d.date)}
                year={year}
                month={month}
                todayStr={todayStr}
                adjustment={adjustment}
                onAdjustmentChange={(newAdj) => setAdjustment(newAdj)}
              />
            )}
          </>
        )}

        {/* Settings Modal */}
        <PrayerSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          activeLocation={activeLocation}
          isManual={isManual}
          method={method}
          school={school}
          onSearch={handleSearchLocation}
          onResetGps={handleResetGps}
          onSaveConfig={handleSaveConfig}
          loading={loading}
        />

        {/* Day Detail Modal */}
        {selectedDayModal && (
          <PrayerDayDetailModal
            dayData={selectedDayModal}
            onClose={() => setSelectedDayModal(null)}
            activeLocation={activeLocation}
          />
        )}

      </div>
    </div>
  );
}
