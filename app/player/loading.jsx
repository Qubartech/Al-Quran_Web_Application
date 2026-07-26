export default function Loading() {
  return (
    <div className="px-5 py-8 min-h-[calc(100vh-100px)] max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8 relative overflow-hidden animate-pulse text-gray-900 dark:text-gray-100">
      
      {/* 1. Left Side: Spinning Disc / Reciter Visualizer Card Skeleton */}
      <div className="w-full lg:w-[40%] flex flex-col items-center">
        <div className="w-full p-8 rounded-2xl glass border border-gray-250/20 dark:border-slate-800/80 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Glowing disc placeholder */}
          <div className="relative my-8">
            <div className="w-52 h-52 md:w-60 md:h-60 rounded-full border-4 border-gray-300/20 flex items-center justify-center relative shadow-2xl bg-gray-300 dark:bg-slate-700">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-400 dark:bg-slate-600 flex items-center justify-center">
                {/* Center hole */}
                <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-900"></div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-2.5 mt-2">
            <div className="h-3 w-32 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-7 w-48 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-3.5 w-36 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-4.5 w-44 bg-gray-300 dark:bg-slate-700 rounded-full mt-1"></div>
          </div>

          {/* Selector Dropdown Skeleton */}
          <div className="w-full mt-8 flex flex-col gap-2">
            <div className="h-3 w-20 bg-gray-300 dark:bg-slate-700 rounded-full self-start"></div>
            <div className="w-full h-10 bg-gray-300 dark:bg-slate-700 rounded-xl"></div>
          </div>

        </div>
      </div>

      {/* 2. Right Side: Immersive Verse Reader & Big Playback controls Skeleton */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6">
        
        {/* Dynamic Verse Reader Skeleton */}
        <div className="flex-1 p-8 rounded-2xl glass border border-gray-250/20 dark:border-slate-800/80 shadow-2xl flex flex-col justify-center min-h-[300px] relative overflow-hidden">
          {/* Top-left Indicator */}
          <div className="absolute top-4 left-4 h-4 w-20 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          
          <div className="flex flex-col gap-6 py-6 text-center">
            {/* Arabic Words Line Skeletons */}
            <div className="flex flex-wrap gap-x-3 gap-y-5 justify-center w-full pb-7">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-8 w-12 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
              ))}
            </div>
            {/* Translation Text Skeletons */}
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-150/40 dark:border-slate-800/60">
              <div className="h-4.5 w-[90%] bg-gray-300 dark:bg-slate-700 rounded-full self-start"></div>
              <div className="h-4.5 w-[75%] bg-gray-300 dark:bg-slate-700 rounded-full self-start"></div>
            </div>
          </div>
        </div>

        {/* Playback Controls Skeleton */}
        <div className="p-6 rounded-2xl glass border border-gray-250/20 dark:border-slate-800/80 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Metadata Label */}
            <div className="h-4 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            
            {/* Buttons Row */}
            <div className="flex items-center gap-4">
              {/* Prev Button */}
              <div className="h-10 w-10 bg-gray-300 dark:bg-slate-700 rounded-xl"></div>
              {/* Main Play Button */}
              <div className="w-14 h-14 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              {/* Next Button */}
              <div className="h-10 w-10 bg-gray-300 dark:bg-slate-700 rounded-xl"></div>
            </div>

            {/* Current Playing Label */}
            <div className="h-4 w-28 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>

      </div>

    </div>
  );
}
