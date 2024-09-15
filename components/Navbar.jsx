"use client"
import { useTheme } from 'next-themes';
import  Link  from 'next/link';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useEffect } from 'react';

function Navbar() {
  const { theme, setTheme } = useTheme();
  const colorTheme = theme === "dark" ? "light" : "dark";

  const toggleDarkMode = () => {
    setTheme(colorTheme);

    setCookie("__theme__", colorTheme, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
    });
  };

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  return (
    <div className="px-5 bg-white dark:dark:bg-[#1a253c] mb-4 shadow fixed left-0 right-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto py-4 flex justify-between items-center">
        <div className="text-3xl font-semibold">
          <Link href="/">Quran</Link>
        </div>
        <div>
          <DarkModeSwitch
            checked={theme === "dark" ? true : false}
            onChange={toggleDarkMode}
            size={19}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
