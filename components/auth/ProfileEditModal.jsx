"use client";

import { useState, useEffect } from "react";
import { X, User, Calendar, Headphones, BookOpen, Clock, Loader2, Check, AlertCircle } from "lucide-react";
import { useUser } from "@/context/UserProvider";

export default function ProfileEditModal({ isOpen, onClose }) {
  const { session } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [preferredReciter, setPreferredReciter] = useState("mishari_al_afasy");
  const [preferredTranslation, setPreferredTranslation] = useState("sahih_international");
  const [dailyGoal, setDailyGoal] = useState("15");

  // Fetch current user profile
  useEffect(() => {
    if (isOpen && session?.access_token) {
      setLoading(true);
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setName(data.name || "");
            setBirthdate(data.birthdate ? data.birthdate.split("T")[0] : "");
            setPreferredReciter(data.preferredReciter || "mishari_al_afasy");
            setPreferredTranslation(data.preferredTranslation || "sahih_international");
            setDailyGoal(String(data.dailyGoal || 15));
          }
        })
        .catch((err) => console.error("Error fetching profile:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, session?.access_token]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name,
          birthdate,
          preferredReciter,
          preferredTranslation,
          dailyGoal,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile changes.");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primaryColor dark:text-primaryColor-light">
              Account Settings
            </span>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              Edit Quran Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primaryColor" />
            <span className="text-xs font-bold">Loading Profile...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check size={16} className="shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                />
                <User className="absolute left-3 top-3 text-gray-400" size={14} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Birthdate
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                />
                <Calendar className="absolute left-3 top-3 text-gray-400" size={14} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Preferred Reciter
              </label>
              <div className="relative">
                <select
                  value={preferredReciter}
                  onChange={(e) => setPreferredReciter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 cursor-pointer"
                >
                  <option value="mishari_al_afasy">Mishary Rashid Alafasy</option>
                  <option value="abdul_baset">AbdulBaset AbdulSamad</option>
                  <option value="maher_al_muaiqly">Maher Al-Muaiqly</option>
                  <option value="saad_al_ghamdi">Saad Al-Ghamdi</option>
                </select>
                <Headphones className="absolute left-3 top-3 text-gray-400" size={14} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Translation
                </label>
                <div className="relative">
                  <select
                    value={preferredTranslation}
                    onChange={(e) => setPreferredTranslation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 cursor-pointer"
                  >
                    <option value="sahih_international">Sahih International</option>
                    <option value="clear_quran">The Clear Quran</option>
                    <option value="yusuf_ali">Yusuf Ali</option>
                  </select>
                  <BookOpen className="absolute left-3 top-3 text-gray-400" size={14} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Daily Goal
                </label>
                <div className="relative">
                  <select
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 cursor-pointer"
                  >
                    <option value="5">5 Mins / Day</option>
                    <option value="15">15 Mins / Day</option>
                    <option value="30">30 Mins / Day</option>
                    <option value="60">60 Mins / Day</option>
                  </select>
                  <Clock className="absolute left-3 top-3 text-gray-400" size={14} />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primaryColor text-white text-xs font-extrabold hover:bg-emerald-600 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
