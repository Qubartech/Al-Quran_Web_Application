"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { learnLevels } from "@/lib/learnData";
import LearnLessonModal from "@/components/learn/LearnLessonModal";
import LearnQuizModal from "@/components/learn/LearnQuizModal";
import { useUser } from "@/context/UserProvider";
import {
  GraduationCap,
  CheckCircle2,
  Play,
  HelpCircle,
  Trophy,
  Lock,
  LogIn,
  Loader2,
  Sparkles,
  Award,
  BookOpen,
  Search,
  Check,
  Target,
  Flame,
  BrainCircuit,
  BookmarkCheck
} from "lucide-react";

export default function LearnPage() {
  const { user, session } = useUser();
  const [completedModules, setCompletedModules] = useState([]);
  const [quizScores, setQuizScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeLessonModule, setActiveLessonModule] = useState(null);
  const [activeQuizModule, setActiveQuizModule] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState("level-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch progress from database if logged in, or fallback to localStorage
  useEffect(() => {
    if (user && session?.access_token) {
      setLoading(true);
      fetch("/api/learn", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const completed = data.filter((item) => item.completed).map((item) => item.moduleId);
            const scores = {};
            data.forEach((item) => {
              if (item.quizScore !== null) {
                scores[item.moduleId] = item.quizScore;
              }
            });
            setCompletedModules(completed);
            setQuizScores(scores);
          }
        })
        .catch((err) => console.error("Error fetching learn progress:", err))
        .finally(() => setLoading(false));
    } else {
      try {
        const saved = localStorage.getItem("quran_learn_completed");
        if (saved) {
          setCompletedModules(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed loading local learn progress:", e);
      }
    }
  }, [user, session?.access_token]);

  const markModuleCompleted = async (moduleId, quizScore = null, maxScore = null) => {
    setCompletedModules((prev) => {
      if (prev.includes(moduleId)) return prev;
      const updated = [...prev, moduleId];
      if (!user) {
        try {
          localStorage.setItem("quran_learn_completed", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    if (quizScore !== null) {
      setQuizScores((prev) => ({ ...prev, [moduleId]: quizScore }));
    }

    setActiveLessonModule(null);
    setActiveQuizModule(null);

    // Save to Database if authenticated
    if (user && session?.access_token) {
      try {
        await fetch("/api/learn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            moduleId,
            completed: true,
            quizScore,
            maxScore,
          }),
        });
      } catch (err) {
        console.error("Failed persisting learn progress to database:", err);
      }
    }
  };

  // Calculate statistics across all levels & modules
  const { totalModulesCount, totalQuizzesCount, totalQuestionsCount, categories } = useMemo(() => {
    let mods = 0;
    let quizzes = 0;
    let questions = 0;
    const cats = new Set(["All"]);

    learnLevels.forEach((lvl) => {
      lvl.modules.forEach((mod) => {
        mods++;
        if (mod.category) cats.add(mod.category);
        if (mod.quiz && mod.quiz.length > 0) {
          quizzes++;
          questions += mod.quiz.length;
        }
      });
    });

    return {
      totalModulesCount: mods,
      totalQuizzesCount: quizzes,
      totalQuestionsCount: questions,
      categories: Array.from(cats),
    };
  }, []);

  const overallProgressPercentage = Math.round(
    (completedModules.length / (totalModulesCount || 1)) * 100
  );

  const selectedLevel = learnLevels.find((l) => l.id === selectedLevelId) || learnLevels[0];

  // Filter modules based on search query and category filter
  const filteredModules = useMemo(() => {
    return selectedLevel.modules.filter((mod) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || mod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [selectedLevel, searchQuery, selectedCategory]);

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors py-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Auth Callout Banner for Guests */}
      {!user && (
        <div className="mb-6 p-4 rounded-2xl glass border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                Sign in to save progress & quiz scores permanently!
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Guest progress is stored locally on this browser. Log in to sync across all your devices.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("quran-open-auth"))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primaryColor text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn size={14} />
            Sign In Now
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl glass border border-primaryColor/10 dark:border-emerald-500/10 shadow-lg mb-8 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/15 dark:via-teal-500/15 dark:to-cyan-500/15 z-0"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-primaryColor dark:text-primaryColor-light flex items-center gap-2">
              <GraduationCap size={18} />
              Quranic Academy & Interactive Quizzes
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
              Master Arabic, Tajweed & Quranic Grammar
            </h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-2xl">
              Structured 6-level academy featuring interactive slides, vocabulary cards, Tajweed rules, morphology, tafseer context, and multi-question quizzes.
            </p>
          </div>

          {/* Progress Card */}
          <div className="w-full lg:w-80 bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-gray-200/50 dark:border-slate-800/70 backdrop-blur-md shrink-0 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-500" />
                Academy Progress
              </span>
              <span className="text-xs font-black text-primaryColor dark:text-primaryColor-light">
                {loading ? <Loader2 size={12} className="animate-spin inline" /> : `${overallProgressPercentage}%`}
              </span>
            </div>

            <div className="h-3 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/80 text-[11px] font-bold text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <BookmarkCheck size={13} className="text-emerald-500" />
                <span>{completedModules.length}/{totalModulesCount} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HelpCircle size={13} className="text-amber-500" />
                <span>{Object.keys(quizScores).length}/{totalQuizzesCount} Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academy Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl glass border border-gray-200/50 dark:border-slate-800/80 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">
              Academy Levels
            </span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100">
              {learnLevels.length} Levels
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass border border-gray-200/50 dark:border-slate-800/80 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Target size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">
              Total Modules
            </span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100">
              {totalModulesCount} Modules
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass border border-gray-200/50 dark:border-slate-800/80 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <BrainCircuit size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">
              Interactive Quizzes
            </span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100">
              {totalQuizzesCount} Quizzes
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass border border-gray-200/50 dark:border-slate-800/80 flex items-center gap-3 shadow-sm">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Flame size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">
              Quiz Questions
            </span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100">
              {totalQuestionsCount}+ Questions
            </span>
          </div>
        </div>
      </div>

      {/* Level Selection Cards Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 px-1">
          Select Academy Level
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {learnLevels.map((lvl) => {
            const isSelected = lvl.id === selectedLevelId;
            const lvlCompletedCount = lvl.modules.filter((m) =>
              completedModules.includes(m.id)
            ).length;
            const lvlTotalCount = lvl.modules.length;
            const lvlProgress = Math.round((lvlCompletedCount / lvlTotalCount) * 100);

            return (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevelId(lvl.id);
                  setSelectedCategory("All");
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-slate-800 border-primaryColor shadow-lg shadow-emerald-500/10 scale-102"
                    : "glass glass-hover border-gray-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{lvl.icon}</span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-emerald-500 text-white"
                        : "bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light"
                    }`}
                  >
                    Level {lvl.levelNumber}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold truncate mb-1">
                  {lvl.title}
                </h4>

                <div className="flex items-center justify-between text-[10px] font-bold opacity-80 mt-2">
                  <span>{lvlCompletedCount}/{lvlTotalCount} Lessons</span>
                  <span>{lvlProgress}%</span>
                </div>

                <div className="h-1.5 w-full bg-gray-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${lvlProgress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Level Header & Search / Filters */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl glass border border-gray-200/60 dark:border-slate-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primaryColor dark:text-primaryColor-light">
                Level {selectedLevel.levelNumber} Curriculum
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light">
                {selectedLevel.badge}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {selectedLevel.title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              {selectedLevel.subtitle}
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-primaryColor transition-all"
              />
            </div>

            {categories.length > 2 && (
              <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primaryColor text-white"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredModules.map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            const userScore = quizScores[mod.id];
            const hasQuiz = mod.quiz && mod.quiz.length > 0;

            return (
              <div
                key={mod.id}
                className="p-6 rounded-3xl glass border border-gray-200/60 dark:border-slate-800/80 flex flex-col justify-between group hover:border-primaryColor/40 transition-all shadow-sm relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {mod.category && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {mod.category}
                        </span>
                      )}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                        {mod.estimatedMinutes} Mins
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {userScore !== undefined && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          <Award size={11} />
                          Quiz: {userScore}/{mod.quiz.length}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          Done
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-primaryColor transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-6 border-t border-gray-100 dark:border-slate-800/60 mt-6">
                  <button
                    onClick={() => setActiveLessonModule(mod)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-primaryColor text-white text-xs font-bold hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play size={14} fill="white" />
                    {isCompleted ? "Review Lesson" : "Start Lesson"}
                  </button>

                  {hasQuiz && (
                    <button
                      onClick={() => setActiveQuizModule(mod)}
                      className="py-2.5 px-3 rounded-xl border border-gray-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Take Module Quiz"
                    >
                      <HelpCircle size={14} className="text-amber-500" />
                      Quiz ({mod.quiz.length} Qs)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="p-12 text-center glass rounded-3xl border border-gray-200/60 dark:border-slate-800/80">
            <Search size={32} className="mx-auto text-gray-400 mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No lessons match your filter</h4>
            <p className="text-xs text-gray-400 mt-1">Try clearing your search or category selection.</p>
          </div>
        )}
      </div>

      {/* Quick Quiz Challenge Banner */}
      <div className="mt-12 p-6 md:p-8 rounded-3xl glass border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
            <Trophy size={32} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-0.5">
              Academy Quiz Challenge
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              Test Your Knowledge Across All Levels!
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              Select any level above or click "Quiz" on any module card to test your Arabic, Tajweed, and Grammar comprehension.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            // Find first available module with quiz
            const firstModWithQuiz = selectedLevel.modules.find((m) => m.quiz && m.quiz.length > 0);
            if (firstModWithQuiz) {
              setActiveQuizModule(firstModWithQuiz);
            }
          }}
          className="px-6 py-3 rounded-2xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles size={16} />
          Launch Level {selectedLevel.levelNumber} Quiz
        </button>
      </div>

      {/* Lesson Modal */}
      {activeLessonModule && (
        <LearnLessonModal
          module={activeLessonModule}
          levelTitle={selectedLevel.title}
          onClose={() => setActiveLessonModule(null)}
          onComplete={(modId) => markModuleCompleted(modId)}
        />
      )}

      {/* Quiz Modal */}
      {activeQuizModule && (
        <LearnQuizModal
          module={activeQuizModule}
          levelTitle={selectedLevel.title}
          onClose={() => setActiveQuizModule(null)}
          onPass={(modId, score, max) => markModuleCompleted(modId, score, max)}
        />
      )}
    </main>
  );
}
