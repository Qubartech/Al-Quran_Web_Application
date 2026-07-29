"use client";

import { useState, useEffect } from "react";
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
  Award
} from "lucide-react";

export default function LearnPage() {
  const { user, session } = useUser();
  const [completedModules, setCompletedModules] = useState([]);
  const [quizScores, setQuizScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeLessonModule, setActiveLessonModule] = useState(null);
  const [activeQuizModule, setActiveQuizModule] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState("level-1");

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
    // Update local state immediately for instant feedback
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

  // Calculate total modules count across all levels
  const totalModulesCount = learnLevels.reduce(
    (acc, lvl) => acc + lvl.modules.length,
    0
  );
  const overallProgressPercentage = Math.round(
    (completedModules.length / (totalModulesCount || 1)) * 100
  );

  const selectedLevel = learnLevels.find((l) => l.id === selectedLevelId) || learnLevels[0];

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors py-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Auth Callout Banner for Guests */}
      {!user && (
        <div className="mb-6 p-4 rounded-2xl glass border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl glass border border-primaryColor/10 dark:border-emerald-500/10 shadow-sm mb-8 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-r from-primaryColor/5 via-teal-500/5 to-cyan-500/5 dark:from-primaryColor/10 dark:via-teal-500/10 dark:to-cyan-500/10 z-0"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primaryColor dark:text-primaryColor-light flex items-center gap-2">
              <GraduationCap size={16} />
              Quranic Academy
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Learn Quran: Basic to Advanced
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              Interactive step-by-step academy designed for all ages. Master Arabic alphabets (Qaida), Tajweed rules, key vocabulary, and Quranic grammar.
            </p>
          </div>

          {/* Progress Card */}
          <div className="w-full lg:w-80 bg-white/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-gray-200/40 dark:border-slate-800/60 backdrop-blur-md shrink-0 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" />
                Academy Progress
              </span>
              <span className="text-xs font-black text-primaryColor dark:text-primaryColor-light">
                {loading ? <Loader2 size={12} className="animate-spin inline" /> : `${overallProgressPercentage}%`}
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
              <span>{completedModules.length} of {totalModulesCount} Lessons Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mb-6">
        {learnLevels.map((lvl) => {
          const isSelected = lvl.id === selectedLevelId;

          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelId(lvl.id)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-left transition-all shrink-0 ${
                isSelected
                  ? "bg-primaryColor text-white border-primaryColor shadow-md shadow-emerald-500/20 scale-102"
                  : "glass glass-hover border-gray-200/50 dark:border-slate-800/80 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span className="text-2xl">{lvl.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider opacity-90">
                    Level {lvl.levelNumber}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light"
                    }`}
                  >
                    {lvl.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold truncate max-w-[160px]">
                  {lvl.title}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Level Header & Modules Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 rounded-2xl glass border border-gray-200/50 dark:border-slate-800/80">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primaryColor dark:text-primaryColor-light">
              Level {selectedLevel.levelNumber} Curriculum
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {selectedLevel.title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              {selectedLevel.subtitle}
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {selectedLevel.modules.map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            const userScore = quizScores[mod.id];

            return (
              <div
                key={mod.id}
                className="p-6 rounded-3xl glass border border-gray-200/60 dark:border-slate-800/80 flex flex-col justify-between group hover:border-primaryColor/40 transition-all shadow-sm relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                      {mod.estimatedMinutes} Mins
                    </span>
                    <div className="flex items-center gap-1.5">
                      {userScore !== undefined && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          <Award size={10} />
                          Quiz Score: {userScore}
                        </span>
                      )}
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">
                          {mod.slides.length} Slides
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
                    className="flex-1 py-2.5 px-3 rounded-xl bg-primaryColor text-white text-xs font-bold hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play size={14} fill="white" />
                    {isCompleted ? "Review Lesson" : "Start Lesson"}
                  </button>

                  {mod.quiz && mod.quiz.length > 0 && (
                    <button
                      onClick={() => setActiveQuizModule(mod)}
                      className="py-2.5 px-3 rounded-xl border border-gray-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      title="Take Module Quiz"
                    >
                      <HelpCircle size={14} className="text-amber-500" />
                      Quiz
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
