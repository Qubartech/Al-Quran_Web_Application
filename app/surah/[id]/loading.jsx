export default function Loading() {
  return (
    <div className="px-3 md:px-5 py-4 min-h-screen animate-pulse text-gray-900 dark:text-gray-100">
      
      {/* Hero Header Card Skeleton */}
      <div className="py-10 md:py-12 bg-gray-50/40 dark:bg-slate-900/40 rounded-2xl relative overflow-hidden glass shadow-sm mb-2 flex flex-col gap-4 justify-center items-center">
        
        {/* Number Badge */}
        <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-slate-700"></div>
        
        {/* Surah Name */}
        <div className="h-9 w-60 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
        
        {/* Translated Meaning */}
        <div className="h-4 w-40 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
        
        {/* Metadata Chips */}
        <div className="flex gap-3">
          <div className="h-7 w-20 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-7 w-24 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>

      {/* Ornamental Divider Skeleton */}
      <div className="flex items-center gap-3 my-4 mx-4 md:mx-8">
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
        <div className="w-5 h-5 bg-gray-300 dark:bg-slate-700 rounded-sm rotate-45"></div>
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
      </div>

      {/* Bismillah Skeleton */}
      <div className="flex justify-center py-6">
        <div className="h-8 w-64 md:w-80 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
      </div>

      {/* Verses List Skeleton */}
      <div className="flex flex-col gap-3 md:gap-4 mt-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="px-3 md:px-6 py-4 md:py-6 flex gap-2.5 md:gap-5 w-full rounded-xl bg-white/20 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-800/20">
            
            {/* Left Action Column */}
            <div className="flex flex-col items-center gap-1 md:gap-2 shrink-0">
              {/* Star Badge */}
              <div className="w-7 h-7 md:w-10 md:h-10 bg-gray-300 dark:bg-slate-700 rounded-lg rotate-45"></div>
              {/* Play Button */}
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              {/* Bookmark */}
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
            </div>

            {/* Right Content Column */}
            <div className="w-full flex flex-col gap-4">
              {/* Arabic Text (right aligned) */}
              <div className="flex flex-col items-end w-full gap-2">
                <div className="h-8 w-[75%] bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-8 w-[50%] bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
              </div>
              {/* Gradient Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent"></div>
              {/* Translation Text (left aligned) */}
              <div className="flex flex-col items-start w-full gap-2">
                <div className="h-4 w-[90%] bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                <div className="h-4 w-[60%] bg-gray-300 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
