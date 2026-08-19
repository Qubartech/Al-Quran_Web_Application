export const metadata = {
  title: "Surah - Al-Quran",
  description: "Read, listen, and contemplate all chapters of the Holy Quran with verse-by-verse translation and word audio.",
};

export default function SurahLayout({ children }) {
  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col">
      {/* Subtle Top Ambient Emerald Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-emerald-500/5 via-teal-500/5 to-transparent pointer-events-none -z-10 blur-3xl" />
      
      {/* Surah Content Viewport */}
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

