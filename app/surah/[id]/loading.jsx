export default function Loading() {
  return (
    <div className="px-5 py-4 min-h-screen animate-pulse text-gray-900 dark:text-gray-100 max-w-screen-xl mx-auto">
      
      {/* Hero Header Card Skeleton */}
      <div className="py-8 border-b border-gray-200/50 dark:border-slate-800/80 bg-gray-50/40 dark:bg-slate-900/40 rounded-2xl relative overflow-hidden glass shadow-sm mb-6 flex flex-col gap-4 justify-center items-center">
        
        {/* Number Badge */}
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-slate-700"></div>
        
        {/* Surah Name */}
        <div className="h-9 w-60 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
        
        {/* Translated Meaning */}
        <div className="h-4 w-40 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
        
        {/* Metadata Row */}
        <div className="flex gap-4">
          <div className="h-3.5 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-3.5 w-16 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>

      {/* Verses List Skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="py-1">
            <div className="px-3 md:px-6 py-6 flex gap-4 justify-between w-full border-b border-gray-250/50 dark:border-slate-800/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
              
              {/* Left Action Column */}
              <div className="md:w-12 flex flex-col items-center gap-3 shrink-0">
                {/* Verse Number Label */}
                <div className="h-3 w-8 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                {/* Play Button */}
                <div className="h-8 w-8 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                {/* Bookmark Button */}
                <div className="h-6 w-6 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
              </div>

              {/* Right Content Column */}
              <div className="w-full flex flex-col gap-4">
                {/* Arabic Text (right aligned) */}
                <div className="flex flex-col items-end w-full gap-2">
                  <div className="h-8 w-[75%] bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
                  <div className="h-8 w-[50%] bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
                </div>
                {/* Translation Text (left aligned) */}
                <div className="flex flex-col items-start w-full gap-2 mt-2">
                  <div className="h-4 w-[90%] bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                  <div className="h-4 w-[60%] bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
