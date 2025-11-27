"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";

function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const colorTheme = resolvedTheme === "dark" ? "light" : "dark";

  const toggleDarkMode = () => {
    setTheme(colorTheme);

    setCookie("__theme__", colorTheme, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="px-5 bg-white/40 dark:bg-[rgba(26,37,60,0.4)] backdrop-blur-md transition-colors duration-300 mb-4 shadow fixed top-0 left-0 right-0 w-full z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto py-4 flex justify-between items-center">
        <div className="text-3xl font-semibold">
          <Link href="/">Quran</Link>
        </div>
        <div>
          {mounted && (
            <DarkModeSwitch
              checked={resolvedTheme === "dark"}
              onChange={toggleDarkMode}
              size={19}
              sunColor="#000"
              moonColor="#fff"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
