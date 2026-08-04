"use client";

import { useEffect, useState, useMemo } from "react";
import { QURAN_API_BASE_URL, QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import { useUser } from "@/context/UserProvider";
import { useAudio } from "@/context/AudioProvider";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Bookmark, 
  History, 
  Trash2, 
  Play, 
  Pause,
  Loader2, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Search, 
  Copy, 
  Check, 
  GraduationCap, 
  ChevronRight,
  TrendingUp,
  Award,
  Target,
  Type,
  Volume2,
  Compass
} from "lucide-react";
import Link from "next/link";

const MASTERY_BADGES = [
  { id: "beginner", min: 1, title: "Seed of Knowledge", icon: "🌱", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", text: "text-emerald-400" },
  { id: "apprentice", min: 3, title: "Tajweed Apprentice", icon: "📖", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30", text: "text-cyan-400" },
  { id: "scholar", min: 6, title: "Quran Scholar", icon: "🎓", color: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  { id: "master", min: 10, title: "Fluent Reciter", icon: "👑", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", text: "text-amber-400" }
];

export default function DashboardPage() {
  const { user, session, signOut, loading: authLoading } = useUser();
  const audio = useAudio();
  const tracker = usePrayerTracker();
  const router = useRouter();

  // Active tab & search states
  const [activeTab, setActiveTab] = useState("ayahs"); // 'ayahs', 'juzs', 'history', 'learning', 'prayer'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurahFilter, setSelectedSurahFilter] = useState("all");
  const [fontSize, setFontSize] = useState("text-3xl"); // 'text-2xl', 'text-3xl', 'text-4xl'
  const [copiedId, setCopiedId] = useState(null);

  // Daily Reading Goal State
  const [dailyGoal, setDailyGoal] = useState(5); // default 5 ayahs/day
  const [todayAyahsRead, setTodayAyahsRead] = useState(3); // calculated / logged

  // Dashboard Data
  const [recents, setRecents] = useState([]);
  const [favoriteAyahs, setFavoriteAyahs] = useState([]);
  const [favoriteJuzs, setFavoriteJuzs] = useState([]);
  const [learnProgress, setLearnProgress] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Sync auth state
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load saved goal from localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem("quran_daily_reading_goal");
    if (savedGoal) setDailyGoal(parseInt(savedGoal, 10));
  }, []);

  // Fetch all user dashboard data
  useEffect(() => {
    if (!user || !session?.access_token) return;

    setLoadingData(true);
    Promise.all([
      fetch("/api/recent", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()).catch(() => []),
      fetch("/api/favorites/ayah", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()).catch(() => []),
      fetch("/api/favorites/juz", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()).catch(() => []),
      fetch("/api/learn", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()).catch(() => []),
    ])
      .then(([recentsData, ayahsData, juzsData, learnData]) => {
        const rList = Array.isArray(recentsData) ? recentsData : [];
        const aList = Array.isArray(ayahsData) ? ayahsData : [];
        const jList = Array.isArray(juzsData) ? juzsData : [];
        const lList = Array.isArray(learnData) ? learnData : [];

        setRecents(rList);
        setFavoriteAyahs(aList);
        setFavoriteJuzs(jList);
        setLearnProgress(lList);

        // Estimate today's read count
        setTodayAyahsRead(Math.min(dailyGoal, Math.max(1, rList.length)));
      })
      .catch((e) => console.error("Error loading dashboard data:", e))
      .finally(() => setLoadingData(false));
  }, [user, session?.access_token, dailyGoal]);

  // Save goal handler
  const handleUpdateGoal = (newGoal) => {
    setDailyGoal(newGoal);
    localStorage.setItem("quran_daily_reading_goal", newGoal);
  };

  // Prayer Tracker Stats
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDailyStatus = tracker?.getDailyStatus(todayStr);
  const streak = tracker?.getStreakCount() || 0;

  // Unique Surahs list for filtering bookmarked ayahs
  const availableSurahFilters = useMemo(() => {
    const surahs = new Set();
    favoriteAyahs.forEach((a) => {
      if (a.surahName) surahs.add(a.surahName);
    });
    return Array.from(surahs);
  }, [favoriteAyahs]);

  // Filtered Bookmarked Ayahs
  const filteredAyahs = useMemo(() => {
    let result = [...favoriteAyahs];

    if (selectedSurahFilter !== "all") {
      result = result.filter((a) => a.surahName === selectedSurahFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.surahName?.toLowerCase().includes(q) ||
          a.translation?.toLowerCase().includes(q) ||
          String(a.surahNumber).includes(q) ||
          String(a.ayahNumber).includes(q)
      );
    }

    return result;
  }, [favoriteAyahs, selectedSurahFilter, searchQuery]);

  // Tajweed completed modules count
  const completedModulesCount = useMemo(() => {
    return learnProgress.filter((l) => l.completed).length;
  }, [learnProgress]);

  // User Mastery Badge
  const userMasteryBadge = useMemo(() => {
    const sorted = [...MASTERY_BADGES].reverse();
    const found = sorted.find((b) => completedModulesCount >= b.min);
    return found || MASTERY_BADGES[0];
  }, [completedModulesCount]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] gap-3 text-slate-500">
        <Loader2 className="animate-spin text-emerald-500" size={36} />
        <span className="text-sm font-extrabold">Authenticating your account...</span>
      </div>
    );
  }

  // Remove bookmark handlers
  const removeAyahBookmark = async (surahNumber, ayahNumber) => {
    try {
      await fetch(`/api/favorites/ayah?surahNumber=${surahNumber}&ayahNumber=${ayahNumber}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setFavoriteAyahs((prev) =>
        prev.filter((a) => !(a.surahNumber === surahNumber && a.ayahNumber === ayahNumber))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const removeJuzBookmark = async (juzId) => {
    try {
      await fetch(`/api/favorites/juz?juzId=${juzId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setFavoriteJuzs((prev) => prev.filter((j) => j.juzId !== juzId));
    } catch (e) {
      console.error(e);
    }
  };

  // Play Recitation trigger
  const playAyah = async (surahNumber, ayahNumber) => {
    try {
      const res = await fetch(
        `${QURAN_API_BASE_URL}/chapter_recitations/7/${surahNumber}?segments=true`
      );
      if (!res.ok) return;
      const json = await res.json();
      const timestamps = json.audio_file?.timestamps || [];
      const verseKey = `${surahNumber}:${ayahNumber}`;
      const verseSeg = timestamps.find((t) => t.verse_key === verseKey);
      const seekTime = (verseSeg?.timestamp_from || 0) / 1000;

      const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;

      audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, `Surah ${surahNumber}`);
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
        );
      }, 500);
    } catch (err) {
      console.error("Error seeking audio:", err);
    }
  };

  const playSurah = (surahNumber, surahName) => {
    const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;
    audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, surahName);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U";
  const goalProgressPercent = Math.min(100, Math.round((todayAyahsRead / dailyGoal) * 100));

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 md:px-6 w-full max-w-screen-2xl mx-auto flex flex-col gap-8 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Ultra Modern User Profile Hero Header */}
      <div className="relative overflow-hidden p-6 md:p-10 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-2xl shadow-emerald-500/20 w-full">
        
        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-72 h-72 rounded-full bg-teal-300/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* User Avatar & Calligraphy Welcome */}
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 dark:border-white/40 flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-xl shrink-0">
                {userInitial}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/30 dark:border-white/30">
                    <Sparkles size={13} className="text-amber-300" /> Active Seeker
                  </span>
                  
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/30 dark:border-white/30">
                    <span>{userMasteryBadge.icon}</span>
                    <span>{userMasteryBadge.title}</span>
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm truncate max-w-lg">
                  {user.email}
                </h1>
              </div>
            </div>

            <p className="text-xs md:text-sm text-emerald-100 font-medium leading-relaxed">
              Welcome to your personal Quran workspace. Review saved verses, track reading history, monitor Salah habit streaks, and complete Tajweed modules.
            </p>
          </div>

          {/* Daily Quran Goal Tracker Card */}
          <div className="relative p-5 md:p-6 rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/35 dark:border-white/35 shadow-2xl flex flex-col gap-4 min-w-[320px] md:min-w-[370px]">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-100 flex items-center gap-2 shrink-0">
                <Target size={16} className="text-amber-300 shrink-0" />
                <span>Daily Quran Reading Goal</span>
              </span>

              {/* Goal Selector Pill */}
              <select
                value={dailyGoal}
                onChange={(e) => handleUpdateGoal(parseInt(e.target.value, 10))}
                className="bg-white/25 hover:bg-white/35 border border-white/40 dark:border-white/40 text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer shrink-0 transition-all shadow-sm"
              >
                <option value={3} className="text-slate-900">3 Verses / day</option>
                <option value={5} className="text-slate-900">5 Verses / day</option>
                <option value={10} className="text-slate-900">10 Verses / day</option>
                <option value={20} className="text-slate-900">20 Verses / day</option>
              </select>
            </div>

            <div className="flex items-baseline justify-between text-white">
              <span className="text-2xl md:text-3xl font-black font-mono">
                {todayAyahsRead} <span className="text-xs font-bold text-emerald-200">/ {dailyGoal} Verses</span>
              </span>
              <span className="text-sm font-black font-mono text-amber-300">
                {goalProgressPercent}% Completed
              </span>
            </div>

            {/* Goal Progress Bar */}
            <div className="w-full bg-white/25 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-300 to-emerald-300 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${goalProgressPercent}%` }}
              ></div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => signOut()}
              className="mt-1 w-full py-2 rounded-xl bg-white/20 hover:bg-rose-600/90 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 border border-white/30 dark:border-white/30 shadow-md"
            >
              <LogOut size={14} />
              Sign Out Account
            </button>
          </div>

        </div>

        {/* Hero Activity Counter Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8 pt-6 border-t border-white/25 dark:border-white/25">
          
          {/* Stat 1: Bookmarked Ayahs */}
          <div 
            onClick={() => setActiveTab("ayahs")}
            className={`p-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-3.5 ${
              activeTab === "ayahs"
                ? "bg-white/30 border-2 border-white/60 dark:border-white/60 shadow-xl scale-105"
                : "bg-white/15 hover:bg-white/25 border border-white/30 dark:border-white/30"
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-400/30 border border-emerald-300/40 flex items-center justify-center text-white shrink-0 shadow-sm">
              <BookOpen size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Saved Verses</span>
              <span className="text-xl font-black text-white font-mono">{favoriteAyahs.length}</span>
            </div>
          </div>

          {/* Stat 2: Saved Juzs */}
          <div 
            onClick={() => setActiveTab("juzs")}
            className={`p-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-3.5 ${
              activeTab === "juzs"
                ? "bg-white/30 border-2 border-white/60 dark:border-white/60 shadow-xl scale-105"
                : "bg-white/15 hover:bg-white/25 border border-white/30 dark:border-white/30"
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-400/30 border border-cyan-300/40 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bookmark size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Saved Juzs</span>
              <span className="text-xl font-black text-white font-mono">{favoriteJuzs.length}</span>
            </div>
          </div>

          {/* Stat 3: Recents History */}
          <div 
            onClick={() => setActiveTab("history")}
            className={`p-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-3.5 ${
              activeTab === "history"
                ? "bg-white/30 border-2 border-white/60 dark:border-white/60 shadow-xl scale-105"
                : "bg-white/15 hover:bg-white/25 border border-white/30 dark:border-white/30"
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-400/30 border border-indigo-300/40 flex items-center justify-center text-white shrink-0 shadow-sm">
              <History size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">History Log</span>
              <span className="text-xl font-black text-white font-mono">{recents.length}</span>
            </div>
          </div>

          {/* Stat 4: Prayer Streak */}
          <div 
            onClick={() => setActiveTab("prayer")}
            className={`p-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-3.5 ${
              activeTab === "prayer"
                ? "bg-white/30 border-2 border-white/60 dark:border-white/60 shadow-xl scale-105"
                : "bg-white/15 hover:bg-white/25 border border-white/30 dark:border-white/30"
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-amber-400/30 border border-amber-300/40 flex items-center justify-center text-amber-200 shrink-0 shadow-sm">
              <Flame size={20} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Salah Streak</span>
              <span className="text-xl font-black text-white font-mono">{streak} Days</span>
            </div>
          </div>

          {/* Stat 5: Tajweed Mastery */}
          <div 
            onClick={() => setActiveTab("learning")}
            className={`p-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-3.5 col-span-2 sm:col-span-1 ${
              activeTab === "learning"
                ? "bg-white/30 border-2 border-white/60 dark:border-white/60 shadow-xl scale-105"
                : "bg-white/15 hover:bg-white/25 border border-white/30 dark:border-white/30"
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-purple-400/30 border border-purple-300/40 flex items-center justify-center text-purple-200 shrink-0 shadow-sm">
              <GraduationCap size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Tajweed Score</span>
              <span className="text-xl font-black text-white font-mono">{completedModulesCount} Done</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("ayahs")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "ayahs"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <BookOpen size={16} />
          Bookmarked Verses ({favoriteAyahs.length})
        </button>

        <button
          onClick={() => setActiveTab("juzs")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "juzs"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bookmark size={16} />
          Saved Juzs ({favoriteJuzs.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "history"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <History size={16} />
          Playback History ({recents.length})
        </button>

        <button
          onClick={() => setActiveTab("learning")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "learning"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <GraduationCap size={16} />
          Tajweed Mastery ({completedModulesCount})
        </button>

        <button
          onClick={() => setActiveTab("prayer")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "prayer"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Flame size={16} className="text-amber-500" />
          Salah Habit Tracker
        </button>
      </div>

      {/* 3. Main Tab Content Display */}
      {loadingData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
          <span className="text-xs font-extrabold">Loading dashboard activity...</span>
        </div>
      ) : (
        <div>
          
          {/* TAB 1: Bookmarked Verses (Ayahs) */}
          {activeTab === "ayahs" && (
            <div className="flex flex-col gap-6">
              
              {/* Control Bar: Search + Surah Filter + Font Size Switcher */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md">
                
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved verses by Surah name or text..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
                  />
                  <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                </div>

                {/* Filter Pills & Font Size Controller */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                  
                  {/* Surah Filter Dropdown */}
                  {availableSurahFilters.length > 0 && (
                    <select
                      value={selectedSurahFilter}
                      onChange={(e) => setSelectedSurahFilter(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl px-3 py-2 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Surahs ({favoriteAyahs.length})</option>
                      {availableSurahFilters.map((sName) => (
                        <option key={sName} value={sName}>
                          Surah {sName}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Arabic Font Size Toggle */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-extrabold uppercase px-2 text-slate-400 flex items-center gap-1">
                      <Type size={12} /> Font
                    </span>

                    <button
                      onClick={() => setFontSize("text-2xl")}
                      className={`px-2 py-0.5 rounded-xl text-xs font-bold transition-all ${
                        fontSize === "text-2xl" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Normal
                    </button>

                    <button
                      onClick={() => setFontSize("text-3xl")}
                      className={`px-2 py-0.5 rounded-xl text-xs font-bold transition-all ${
                        fontSize === "text-3xl" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Large
                    </button>

                    <button
                      onClick={() => setFontSize("text-4xl")}
                      className={`px-2 py-0.5 rounded-xl text-xs font-bold transition-all ${
                        fontSize === "text-4xl" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      XL
                    </button>
                  </div>

                </div>

              </div>

              {/* Saved Ayahs List */}
              {filteredAyahs.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
                  <BookOpen size={40} className="text-slate-300 dark:text-slate-700" />
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                    No bookmarked verses found
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Bookmark verses while reading any Surah to save your favorite Ayahs here for quick reflection and recitation!
                  </p>
                  <Link
                    href="/surah"
                    className="mt-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-600/30"
                  >
                    Browse Surahs Now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredAyahs.map((item) => {
                    const trackId = `ayah_${item.surahNumber}_${item.ayahNumber}`;
                    const isAudioPlaying = audio?.trackId === trackId && audio?.isPlaying;

                    return (
                      <div
                        key={item.id}
                        className={`p-6 md:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col gap-4 group ${
                          isAudioPlaying
                            ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                            : "bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {/* Verse Card Header */}
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                          <Link
                            href={`/surah/${item.surahNumber}`}
                            className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                          >
                            <span>Surah {item.surahName}</span>
                            <span className="text-slate-400 font-mono">• Verse {item.ayahNumber}</span>
                          </Link>

                          <div className="flex items-center gap-2">
                            {/* Play Verse Button */}
                            <button
                              onClick={() => playAyah(item.surahNumber, item.ayahNumber)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isAudioPlaying
                                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 animate-pulse"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                              }`}
                              title="Play Verse Recitation"
                            >
                              {isAudioPlaying ? (
                                <>
                                  <Pause size={13} className="fill-white" /> Playing
                                </>
                              ) : (
                                <>
                                  <Play size={13} className="fill-emerald-600 dark:fill-emerald-400" /> Listen
                                </>
                              )}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(`"${item.translation}" - Surah ${item.surahName} (${item.surahNumber}:${item.ayahNumber})`, item.id)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 transition-colors"
                              title="Copy Verse"
                            >
                              {copiedId === item.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                            </button>

                            {/* Delete Bookmark Button */}
                            <button
                              onClick={() => removeAyahBookmark(item.surahNumber, item.ayahNumber)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                              title="Remove Bookmark"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Arabic Calligraphy with Custom Font Size */}
                        <p className={`font-arabic ${fontSize} text-right leading-loose text-slate-900 dark:text-slate-100 font-medium select-none`} dir="rtl">
                          {item.arabicText}
                        </p>

                        {/* Translation */}
                        <p className="text-xs md:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-medium">
                          &quot;{item.translation}&quot;
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Whitelisted Juzs */}
          {activeTab === "juzs" && (
            <div className="flex flex-col gap-6">
              {favoriteJuzs.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
                  <Bookmark size={40} className="text-slate-300 dark:text-slate-700" />
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                    No whitelisted Juzs found
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Save Juz / Para pages for quick 1-click access during daily recitation.
                  </p>
                  <Link
                    href="/juz"
                    className="mt-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-600/30"
                  >
                    Explore 30 Juz / Paras
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteJuzs.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-4 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black font-mono text-base border border-emerald-500/20">
                          #{item.juzId}
                        </div>

                        <button
                          onClick={() => removeJuzBookmark(item.juzId)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                          title="Remove Juz Bookmark"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                          Juz {item.juzId} — {item.juzName || `Para ${item.juzId}`}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Range: Surah {item.startSurah || "1"} to {item.endSurah || "114"}
                        </p>
                      </div>

                      <Link
                        href={`/juz/${item.juzId}`}
                        className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black text-center transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                      >
                        Read Juz {item.juzId}
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Playback History */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-6">
              {recents.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
                  <History size={40} className="text-slate-300 dark:text-slate-700" />
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                    No playback history recorded yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Listen to recitations or read Surahs to automatically track your reading timeline here!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recents.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black font-mono text-sm border border-indigo-500/20">
                          #{item.surahNumber}
                        </div>

                        <div className="flex flex-col">
                          <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                            Surah {item.surahName}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            Chapter {item.surahNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playSurah(item.surahNumber, item.surahName)}
                          className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1 text-xs font-bold"
                          title="Play Recitation"
                        >
                          <Play size={14} fill="white" /> Play
                        </button>
                        <Link
                          href={`/surah/${item.surahNumber}`}
                          className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold"
                        >
                          Read
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Tajweed Mastery & Learning Rewards */}
          {activeTab === "learning" && (
            <div className="flex flex-col gap-6">
              
              {/* Mastery Reward Rank Card */}
              <div className={`p-6 rounded-3xl bg-gradient-to-r ${userMasteryBadge.color} border ${userMasteryBadge.border} shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/20 dark:bg-slate-800/40 flex items-center justify-center text-3xl shadow-inner border border-white/20">
                    {userMasteryBadge.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                      Current Tajweed Mastery Title
                    </span>
                    <h3 className={`text-2xl font-black ${userMasteryBadge.text}`}>
                      {userMasteryBadge.title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Completed {completedModulesCount} Tajweed modules & quizzes
                    </span>
                  </div>
                </div>

                <Link
                  href="/learn"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  Continue Tajweed Lessons
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Badges Overview Grid */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Award size={16} className="text-purple-500" /> Unlockable Mastery Ranks
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MASTERY_BADGES.map((b) => {
                    const isUnlocked = completedModulesCount >= b.min;
                    return (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                          isUnlocked
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-md"
                            : "bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-50"
                        }`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">{b.title}</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {isUnlocked ? "Unlocked!" : `Req: ${b.min} Modules`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modules Completed Breakdown */}
              {learnProgress.length > 0 && (
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Lesson Modules Log
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learnProgress.map((item) => (
                      <div
                        key={item.moduleId}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                              Module: {item.moduleId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Status: Completed
                            </span>
                          </div>
                        </div>

                        {item.quizScore !== null && (
                          <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            Score: {item.quizScore}/{item.maxScore || 10}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: Salah Habit Tracker */}
          {activeTab === "prayer" && (
            <div className="flex flex-col gap-6">
              <div className="p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Flame size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                        Salah Habit & Daily Prayer Streak
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Perform your 5 daily prayers consistently on time
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/prayer"
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                  >
                    Open Full Prayer Dashboard
                    <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Streak Card */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/30">
                      <Flame size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        Active Prayer Streak
                      </span>
                      <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
                        {streak} Days
                      </span>
                    </div>
                  </div>

                  {/* Today Progress */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/30">
                      <CheckCircle2 size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Today&apos;s Salah Logged
                      </span>
                      <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
                        {todayDailyStatus?.completedCount || 0} / 5 Completed
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
