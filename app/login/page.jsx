"use client";

import { useState } from "react";
import { useUser } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { signIn, signUp, user } = useUser();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess("Success! Check your email to confirm registration.");
        setEmail("");
        setPassword("");
      } else {
        await signIn(email, password);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
        {/* Glow blob inside card */}
        <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-primaryColor/5 dark:bg-emerald-500/5 blur-2xl pointer-events-none"></div>

        <div className="text-center mb-8 shrink-0">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent dark:text-transparent">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
            {isSignUp
              ? "Join to whitelist Ayahs, Juzs, and sync history"
              : "Sign in to access your personal Quran bookmarks"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold leading-relaxed">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primaryColor text-xs shadow-sm"
              />
              <Mail className="absolute left-3 top-3 text-gray-450" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primaryColor text-xs shadow-sm"
              />
              <Lock className="absolute left-3 top-3 text-gray-450" size={14} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                {isSignUp ? "Sign Up" : "Sign In"}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200/40 dark:border-slate-800/60 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setSuccess("");
            }}
            className="text-xs text-primaryColor hover:underline font-bold"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account yet? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
