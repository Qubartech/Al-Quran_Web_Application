"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Download,
  Printer,
  FileSpreadsheet,
  CalendarDays,
  LayoutGrid,
  List,
  Sparkles,
  Navigation,
  Globe,
  Moon
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const QUICK_CITIES = [
  { city: "Makkah", country: "Saudi Arabia" },
  { city: "Madinah", country: "Saudi Arabia" },
  { city: "Dhaka", country: "Bangladesh" },
  { city: "London", country: "United Kingdom" },
  { city: "New York", country: "United States" },
  { city: "Cairo", country: "Egypt" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Kuala Lumpur", country: "Malaysia" }
];

export default function PrayerCalendarHeader({
  year,
  month,
  setYear,
  setMonth,
  activeLocation,
  onSearchLocation,
  onResetGps,
  hijriSummary,
  viewMode,
  setViewMode,
  onOpenSettings,
  onExportCSV,
  onExportICS,
  onPrint,
  loading
}) {
  const [searchInput, setSearchInput] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearchLocation(searchInput.trim());
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full print:hidden">
      
      {/* Top Banner / Hero Title */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-5 sm:p-6 md:p-8 text-white shadow-2xl shadow-emerald-950/40 border border-emerald-500/25">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 text-xs font-extrabold tracking-wider uppercase shadow-inner">
              <Sparkles size={13} className="text-emerald-400 shrink-0" />
              <span>AlAdhan Calculation Engine</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
              Prayer Times Calendar
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Comprehensive monthly timetable with accurate Fajr, Dhuhr, Asr, Maghrib, Isha, Tahajjud times, and Hijri dates.
            </p>
          </div>

          {/* Quick Location & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Location Badge */}
            <div className="flex-1 sm:flex-initial flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-slate-100 min-w-0 shadow-lg">
              <MapPin size={17} className="text-emerald-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-tight">Location</span>
                <span className="font-extrabold text-white truncate max-w-[130px] sm:max-w-[190px]">
                  {activeLocation ? `${activeLocation.city}${activeLocation.country ? `, ${activeLocation.country}` : ""}` : "Loading..."}
                </span>
              </div>
            </div>

            {/* GPS Reset Button */}
            <button
              onClick={onResetGps}
              title="Use GPS Geolocation"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0 shadow-lg"
            >
              <Navigation size={16} />
            </button>

            {/* Calculation Settings Button */}
            <button
              onClick={onOpenSettings}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/25 to-teal-500/25 hover:from-emerald-500/35 hover:to-teal-500/35 border border-emerald-500/45 text-emerald-300 hover:text-white transition-all text-xs sm:text-sm font-extrabold cursor-pointer shrink-0 shadow-lg shadow-emerald-950/40 flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Quick Cities Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1 shrink-0">
            <Globe size={13} /> Quick City:
          </span>
          {QUICK_CITIES.map((loc) => (
            <button
              key={loc.city}
              onClick={() => onSearchLocation(loc.city)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/25 text-xs text-slate-200 hover:text-white transition-all border border-white/15 whitespace-nowrap shrink-0 cursor-pointer font-semibold shadow-sm"
            >
              {loc.city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Control Strip Panel - Compact & Sleek */}
      <div className="flex flex-col gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
        
        {/* Row 1: Month/Year Controls + Hijri Summary Pill */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
          
          {/* Navigation Controls Group */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all shrink-0 cursor-pointer shadow-sm"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Month Dropdown */}
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 text-white font-extrabold text-xs border border-slate-700/90 hover:border-emerald-500 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer shrink-0 shadow-sm"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 text-white font-extrabold text-xs border border-slate-700/90 hover:border-emerald-500 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer shrink-0 shadow-sm"
            >
              {Array.from({ length: 11 }, (_, i) => 2024 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all shrink-0 cursor-pointer shadow-sm"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs hover:bg-emerald-500/30 transition-all border border-emerald-500/35 shrink-0 cursor-pointer shadow-sm"
            >
              Today
            </button>
          </div>

          {/* Hijri Month Banner */}
          {hijriSummary && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold flex items-center justify-center gap-1.5 shrink-0 shadow-sm">
              <CalendarIcon size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">{hijriSummary}</span>
            </div>
          )}
        </div>

        {/* Single Unified Row: Left (Search Input) | Right (View Mode Tabs + Export Button) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 w-full">
          
          {/* Left Side: Search City Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px] md:max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city (e.g. Makkah, London, Cairo)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700/80 focus:border-emerald-500 focus:outline-none transition-colors shadow-inner"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </form>

          {/* Right Side: View Mode Tabs + Export Button */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            
            {/* View Mode Segmented Controls */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 shrink-0 gap-1 shadow-inner overflow-x-auto scrollbar-none">
              <button
                onClick={() => setViewMode("table")}
                title="Table View"
                className={`py-1.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <List size={13} />
                <span>Table</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`py-1.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <LayoutGrid size={13} />
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewMode("year")}
                title="Year View"
                className={`py-1.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "year"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <CalendarDays size={13} />
                <span>Year</span>
              </button>

              <button
                onClick={() => setViewMode("hijri")}
                title="Hijri View"
                className={`py-1.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "hijri"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-400/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Moon size={13} className={viewMode === "hijri" ? "text-slate-950" : "text-amber-400"} />
                <span>Hijri</span>
              </button>
            </div>

            {/* Export Dropdown Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 font-extrabold text-xs transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
              >
                <Download size={14} />
                <span>Export</span>
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-1.5 text-xs flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setShowExportMenu(false)}
                >
                  <button
                    onClick={onPrint}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 font-bold text-left transition-colors cursor-pointer"
                  >
                    <Printer size={14} className="text-emerald-400" />
                    <span>Print / Save PDF</span>
                  </button>

                  <button
                    onClick={onExportCSV}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 font-bold text-left transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet size={14} className="text-teal-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={onExportICS}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 font-bold text-left transition-colors cursor-pointer"
                  >
                    <CalendarIcon size={14} className="text-sky-400" />
                    <span>Export iCal (.ics)</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
