"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Award, RotateCcw } from "lucide-react";

export default function LearnQuizModal({ module, levelTitle, onClose, onPass }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = module?.quiz || [];
  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      const finalScore = score + (selectedOption === currentQ.correctAnswer && !isAnswered ? 1 : 0);
      onPass(module.id, finalScore, questions.length);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  if (!module || !currentQ) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
              Interactive Quiz • Question {currentIndex + 1} of {questions.length}
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
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

        {/* Content */}
        {!showResult ? (
          <div className="p-6 md:p-8 space-y-6">
            <h4 className="text-base md:text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isCorrect = idx === currentQ.correctAnswer;
                const isSelected = idx === selectedOption;

                let borderStyle = "border-gray-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60";
                if (isAnswered) {
                  if (isCorrect) {
                    borderStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                  } else if (isSelected) {
                    borderStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all ${borderStyle} ${
                      !isAnswered ? "hover:border-primaryColor/50 hover:bg-primaryColor/5" : ""
                    }`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={16} className="text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300 animate-fadeIn">
                <span className="font-extrabold block mb-0.5">Explanation:</span>
                {currentQ.explanation}
              </div>
            )}
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light flex items-center justify-center mx-auto">
              <Award size={36} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                Quiz Completed!
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                You scored <span className="font-extrabold text-primaryColor">{score}</span> out of{" "}
                <span className="font-extrabold">{questions.length}</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              >
                <RotateCcw size={14} />
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primaryColor text-white text-xs font-bold hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {!showResult && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                isAnswered
                  ? "bg-primaryColor text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                  : "opacity-40 cursor-not-allowed bg-gray-200 dark:bg-slate-800 text-gray-400"
              }`}
            >
              {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
