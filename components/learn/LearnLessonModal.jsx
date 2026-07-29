"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft, CheckCircle2, Volume2, Sparkles } from "lucide-react";

export default function LearnLessonModal({ module, levelTitle, onClose, onComplete }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = module?.slides || [];
  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      onComplete(module.id);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  if (!module || !currentSlide) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primaryColor dark:text-primaryColor-light">
              {levelTitle} • Lesson {currentSlideIndex + 1} of {slides.length}
            </span>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            {currentSlide.title}
          </h4>

          {currentSlide.content && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {currentSlide.content}
            </p>
          )}

          {/* Bullets if any */}
          {currentSlide.bullets && (
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
              {currentSlide.bullets.map((bullet, idx) => (
                <div key={idx} className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-start gap-2">
                  <span className="text-primaryColor shrink-0 mt-0.5">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grid Items (e.g. Alphabets or Vocab Cards) */}
          {currentSlide.gridItems && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {currentSlide.gridItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl glass border border-gray-200/50 dark:border-slate-800/80 text-center flex flex-col items-center justify-between group hover:border-primaryColor/40 transition-all shadow-sm"
                >
                  <span className="font-arabic text-3xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-primaryColor transition-colors">
                    {item.arabic}
                  </span>
                  <div className="mt-2 text-center">
                    <span className="text-xs font-extrabold text-primaryColor dark:text-primaryColor-light block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium block truncate">
                      {item.trans}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Examples List */}
          {currentSlide.examples && (
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Quranic Examples
              </h5>
              {currentSlide.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                      {ex.trans}
                    </span>
                  </div>
                  <span className="font-arabic text-2xl text-slate-800 dark:text-slate-100 font-medium">
                    {ex.arabic}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentSlideIndex === 0
                ? "opacity-40 cursor-not-allowed text-gray-400"
                : "text-slate-700 dark:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-800"
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlideIndex
                    ? "w-6 bg-primaryColor"
                    : "w-2 bg-gray-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold bg-primaryColor text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all"
          >
            {currentSlideIndex === slides.length - 1 ? (
              <>
                <CheckCircle2 size={16} />
                Complete Lesson
              </>
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
