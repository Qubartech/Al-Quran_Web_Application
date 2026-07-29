"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Calendar, Headphones, BookOpen, Clock, Loader2, AlertCircle } from "lucide-react";
import { useUser } from "@/context/UserProvider";

export default function AuthModal({ isOpen, onClose, initialTab = "signin" }) {
  const { signIn, signUp } = useUser();
  const [tab, setTab] = useState(initialTab); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign In Form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [preferredReciter, setPreferredReciter] = useState("mishari_al_afasy");
  const [preferredTranslation, setPreferredTranslation] = useState("sahih_international");
  const [dailyGoal, setDailyGoal] = useState("15");

  if (!isOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await signUp(email, password);
      const session = data?.session;

      // Sync extended profile details to DB
      if (session?.access_token) {
        await fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name,
            email,
            birthdate,
            preferredReciter,
            preferredTranslation,
            dailyGoal,
          }),
        });
      }

      onClose();
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/75 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto animate-fadeIn">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 p-1 bg-gray-200/50 dark:bg-slate-800/60 rounded-xl">
            <button
              onClick={() => { setTab("signin"); setError(""); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                tab === "signin"
                  ? "bg-white dark:bg-slate-900 text-primaryColor dark:text-primaryColor-light shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setError(""); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                tab === "signup"
                  ? "bg-white dark:bg-slate-900 text-primaryColor dark:text-primaryColor-light shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === "signin" ? (
            /* SIGN IN FORM */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                  />
                  <Mail className="absolute left-3 top-3 text-gray-400" size={14} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                  />
                  <Lock className="absolute left-3 top-3 text-gray-400" size={14} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primaryColor text-white text-xs font-extrabold hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
              </button>
            </form>
          ) : (
            /* SIGN UP FORM (EXTENDED FIELDS) */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
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
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                  />
                  <Mail className="absolute left-3 top-3 text-gray-400" size={14} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                    />
                    <Lock className="absolute left-3 top-3 text-gray-400" size={14} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30"
                    />
                    <Lock className="absolute left-3 top-3 text-gray-400" size={14} />
                  </div>
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

              {/* Quran Preferences Section */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light">
                  Quran Preferences
                </h4>

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
                      Daily Reading Goal
                    </label>
                    <div className="relative">
                      <select
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 cursor-pointer"
                      >
                        <option value="5">5 Minutes / Day</option>
                        <option value="15">15 Minutes / Day</option>
                        <option value="30">30 Minutes / Day</option>
                        <option value="60">60 Minutes / Day</option>
                      </select>
                      <Clock className="absolute left-3 top-3 text-gray-400" size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primaryColor text-white text-xs font-extrabold hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Complete Registration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
