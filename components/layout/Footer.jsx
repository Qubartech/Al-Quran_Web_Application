import React from "react";
import Link from "next/link";
import { BookOpen, Globe, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950/60 border-t border-gray-250/20 dark:border-slate-900/60 backdrop-blur-md mt-16 transition-colors">
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand block */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-500/20">
                Q
              </span>
              <span className="self-center text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tight">
                Al-Quran
              </span>
            </Link>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A premium, interactive Quran application featuring word-by-word highlights, translations, audio recitation streaming, and offline personalization settings. Designed for a beautiful reading and listening experience.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.qubartech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-150 dark:bg-slate-900 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-slate-500 dark:text-slate-400 hover:text-primaryColor transition-all duration-300 border border-transparent hover:border-primaryColor/10"
                title="Qubartech Website"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://github.com/qubartech"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-150 dark:bg-slate-900 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-slate-500 dark:text-slate-400 hover:text-primaryColor transition-all duration-300 border border-transparent hover:border-primaryColor/10"
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com/qubartech"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-150 dark:bg-slate-900 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-slate-500 dark:text-slate-400 hover:text-primaryColor transition-all duration-300 border border-transparent hover:border-primaryColor/10"
                title="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/qubartech"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-150 dark:bg-slate-900 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-slate-500 dark:text-slate-400 hover:text-primaryColor transition-all duration-300 border border-transparent hover:border-primaryColor/10"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Nav links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-primaryColor transition-colors">
                  Surahs List
                </Link>
              </li>
              <li>
                <Link href="/juz" className="hover:text-primaryColor transition-colors">
                  Juz / Paras
                </Link>
              </li>
              <li>
                <Link href="/player" className="hover:text-primaryColor transition-colors">
                  Dedicated Player
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primaryColor transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="https://api.quran.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primaryColor transition-colors">
                  Quran.com API
                </a>
              </li>
              <li>
                <a href="https://www.qubartech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primaryColor transition-colors">
                  Qubartech Developer Portal
                </a>
              </li>
              <li>
                <a href="https://www.qubartech.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-primaryColor transition-colors">
                  Support & Feedback
                </a>
              </li>
              <li>
                <a href="https://github.com/TahirAhmad01/Quran_Application_With_NextJs" target="_blank" rel="noopener noreferrer" className="hover:text-primaryColor transition-colors">
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-emerald-500/10 via-teal-500/20 to-emerald-500/10 my-8"></div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.qubartech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primaryColor hover:underline font-bold"
            >
              Qubartech™
            </a>
            . All Rights Reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Built with</span>
            <Heart size={12} className="text-rose-500 fill-current animate-pulse" />
            <span>by</span>
            <a
              href="https://www.qubartech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 dark:text-slate-200 hover:text-primaryColor font-bold transition-colors"
            >
              Qubartech Team
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
